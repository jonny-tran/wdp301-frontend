
import http from "@/lib/http";
import { LoginInput } from "@/schemas/auth";
import { ENDPOINT_CLIENT, ENDPOINT_SERVER } from "@/utils/endponit";



export const authRequest = {
    login: (data: LoginInput) =>
        http.post<{ accessToken: string; refreshToken: string }>(
            ENDPOINT_CLIENT.LOGIN,
            data
        ),
    // call sever to set up token
    auth: (body: { accessToken: string; refreshToken: string }) =>
        http.post(ENDPOINT_SERVER.LOGIN, body, {
            baseURL: "",
        }),
    logoutClient: () => http.post(ENDPOINT_CLIENT.LOGOUT, {}),
    logoutServer: () =>
        http.post(ENDPOINT_SERVER.LOGOUT, undefined, {
            baseURL: "",
        }),

    // call client to refresh token
    refreshTokenClient: (body: { refreshToken: string }) =>
        http.post<{ accessToken: string }>(ENDPOINT_CLIENT.REFRESH, body),

    // call sever to refresh token 
    refreshTokenServer: (body: { accessToken: string }) =>
        http.post<{ accessToken: string }>(ENDPOINT_SERVER.REFRESH, body,
            {
                baseURL: ""

            }
        ),

};