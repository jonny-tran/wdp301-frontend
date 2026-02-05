import { authRequest } from "@/apiRequest/auth";
import { useSessionStore } from "@/stores/sesionStore";
import envconfig from "@/config";
import { ResponseData, ResponseError } from "@/types/base";
import { toast } from "sonner";
import { EntityError, HttpError } from "@/lib/errors";
import { HttpErrorCode } from "@/utils/enum";

interface CustomOptions extends RequestInit {
    baseURL?: string | undefined;
    params?: Record<string, string | number | boolean | undefined>;
    skipAuth?: boolean;
}

const isExpired = "Token expired";

// Helper: Check runtime
const isServerRuntime = () => typeof window === "undefined";

// Interceptor để quản lý refresh token
class TokenRefreshInterceptor {
    private refreshPromise: Promise<string> | null = null;
    private isRefreshing = false;

    async getValidToken(): Promise<string | null> {
        if (isServerRuntime()) {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                return cookieStore.get("accessToken")?.value || null;
            } catch (error) {
                console.error("Error getting token from cookies:", error);
                return null;
            }
        } else {
            // Client: lấy token từ store
            return useSessionStore.getState().accessToken || null;
        }
    }

    async refreshToken(): Promise<string> {
        // Server không thể refresh token
        if (isServerRuntime()) {
            throw new Error("REFRESH_TOKEN_NOT_SUPPORTED_ON_SERVER");
        }

        // Nếu đang refresh, đợi promise hiện tại (tránh race condition)
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        // Tạo promise mới để refresh
        this.isRefreshing = true;
        this.refreshPromise = this.performRefresh();

        try {
            const newToken = await this.refreshPromise;
            return newToken;
        } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
        }
    }

    private async performRefresh(): Promise<string> {
        const refreshToken = useSessionStore.getState().refreshToken;

        if (!refreshToken) {
            throw new Error("NO_REFRESH_TOKEN");
        }

        try {
            // Gọi API refresh token
            const result = await authRequest.refreshTokenClient({
                refreshToken: refreshToken
            });

            if (!result.data?.accessToken) {
                throw new Error("INVALID_REFRESH_RESPONSE");
            }

            const newAccessToken = result.data.accessToken;
            const newRefreshToken = result.data.refreshToken;

            // Update Zustand store với token mới
            useSessionStore.getState().setSession({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            })


            // Đồng bộ cookie trên server thông qua API route
            try {
                await authRequest.refreshTokenServer({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                });
            } catch (syncError) {
                console.error("Failed to sync token with server:", syncError);
                // Không throw error vì client token vẫn valid
            }

            return newAccessToken;
        } catch (error) {
            // Refresh thất bại -> Clear session và redirect
            this.clearSessionAndRedirect();
            throw error;
        }
    }

    clearSessionAndRedirect() {
        if (isServerRuntime()) {
            // Server: chỉ throw error
            throw new Error("UNAUTHORIZED");
        } else {
            // Client: clear store + toast + redirect
            useSessionStore.getState().clearSession();
            toast.error("Phiên đăng nhập đã hết hạn");
            if (typeof window !== "undefined") {
                window.location.href = `/auth/login`;
            }
        }
    }

    handleAuthError() {
        this.clearSessionAndRedirect();
    }
}

const tokenInterceptor = new TokenRefreshInterceptor();

async function httpRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    options?: CustomOptions,
    retryCount = 0
): Promise<ResponseData<T>> {
    const maxRetries = 1; // Chỉ retry 1 lần sau khi refresh token

    // Prepare body
    const body = options?.body
        ? options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body)
        : undefined;

    // Get auth token
    const authToken = options?.skipAuth
        ? null
        : await tokenInterceptor.getValidToken();

    // Prepare headers
    const baseHeaders: Record<string, string> = {};

    if (!(body instanceof FormData)) {
        baseHeaders["Content-Type"] = "application/json";
    }

    if (authToken) {
        baseHeaders["Authorization"] = `Bearer ${authToken}`;
    }

    // Prepare URL
    const baseUrl = options?.baseURL === undefined
        ? envconfig.NEXT_PUBLIC_API_URL
        : options.baseURL;

    const fullUrl = url.startsWith("/")
        ? `${baseUrl}${url}`
        : `${baseUrl}/${url}`;

    // Add query params if exists
    const urlWithParams = options?.params
        ? `${fullUrl}?${new URLSearchParams(
            Object.entries(options.params)
                .filter(([_, v]) => v !== undefined)
                .map(([k, v]) => [k, String(v)])
        ).toString()}`
        : fullUrl;

    // Make request
    const res = await fetch(urlWithParams, {
        ...options,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        } as HeadersInit,
        body,
        method,
    });

    const payload: ResponseData<T> = await res.json();

    // Handle 401 - Token expired
    if (res.status === HttpErrorCode.UNAUTHORIZED && payload.message === isExpired && !options?.skipAuth) {
        // Server: không thể refresh, throw error
        if (isServerRuntime()) {
            tokenInterceptor.handleAuthError();
        }

        // Client: Chỉ retry nếu chưa vượt quá maxRetries
        if (retryCount < maxRetries) {
            try {
                console.log("Token expired, refreshing...");

                // Refresh token
                await tokenInterceptor.refreshToken();

                console.log("Token refreshed successfully, retrying request...");

                // Retry request với token mới
                return httpRequest<T>(method, url, options, retryCount + 1);
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                tokenInterceptor.handleAuthError();
                throw refreshError;
            }
        } else {
            // Đã retry quá số lần cho phép
            console.error("Max retry attempts exceeded");
            tokenInterceptor.handleAuthError();
        }
    }

    // Handle other errors
    if (!res.ok) {
        if (res.status === HttpErrorCode.UNPROCESSABLE_ENTITY) {
            throw new EntityError(
                payload as unknown as ResponseError
            );
        } else {
            throw new HttpError(payload as unknown as ResponseError);
        }
    }

    return payload;
}

const http = {
    get<T>(url: string, options?: CustomOptions) {
        return httpRequest<T>("GET", url, options);
    },

    post<T>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, "body">
    ) {
        return httpRequest<T>("POST", url, { ...options, body });
    },

    put<T>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, "body">
    ) {
        return httpRequest<T>("PUT", url, { ...options, body });
    },

    delete<T>(url: string, options?: Omit<CustomOptions, "body">) {
        return httpRequest<T>("DELETE", url, options);
    },

    patch<T>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, "body">
    ) {
        return httpRequest<T>("PATCH", url, { ...options, body });
    },
};

export default http;