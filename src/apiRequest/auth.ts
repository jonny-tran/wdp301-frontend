import http from "@/lib/http";
import { EmailInput, LoginInput, ResetPasswordInput } from "@/schemas/auth";
import { User } from "@/types/user";
import { ENDPOINT_CLIENT, ENDPOINT_SERVER } from "@/utils/endponit";


export const authRequest = {
  loginClient: (data: LoginInput) =>
    http.post<{ accessToken: string; refreshToken: string }>(
      ENDPOINT_CLIENT.LOGIN,
      data,
    ),
  // call sever to set up token
  loginServer: (body: { accessToken: string; refreshToken: string }) =>
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
    http.post<{ accessToken: string, refreshToken: string }>(ENDPOINT_CLIENT.REFRESH, body, {
      skipAuth: true
    }),

  // call sever to refresh token
  refreshTokenServer: (body: { accessToken: string, refreshToken: string }) =>
    http.post<{ accessToken: string, refreshToken: string }>(ENDPOINT_SERVER.REFRESH, body, {
      baseURL: "",
    }),
  forgotPassword: (data: EmailInput) =>
    http.post<{ message: string }>(ENDPOINT_CLIENT.FORGOT_PASSWORD, data),
  resetPassword: (data: ResetPasswordInput) =>
    http.post<{ message: string }>(ENDPOINT_CLIENT.RESET_PASSWORD, data),
  me: () => http.get<User>(ENDPOINT_CLIENT.PROFILE),
};
