import http from "@/lib/http";
import { CreateUserBodyType, ForgotPasswordBodyType, LoginBodyType, LogoutBodyType, RefreshTokenBodyType, ResetPasswordBodyType } from "@/schemas/auth";
import { AuthTokens, LoginResponse, User } from "@/types/user";
import { ENDPOINT_CLIENT, ENDPOINT_SERVER } from "@/utils/endponit";


export const authRequest = {
  loginClient: (data: LoginBodyType) =>
    http.post<LoginResponse>(
      ENDPOINT_CLIENT.LOGIN,
      data,
    ),
  // call sever to set up token
  loginServer: (body: AuthTokens) =>
    http.post(ENDPOINT_SERVER.LOGIN, body, {
      baseURL: "",
    }),
  logoutClient: (body: LogoutBodyType) => http.post<{ message: string }>(ENDPOINT_CLIENT.LOGOUT, body),
  logoutServer: () =>
    http.post(ENDPOINT_SERVER.LOGOUT, undefined, {
      baseURL: "",
    }),

  // call client to refresh token
  refreshTokenClient: (body: RefreshTokenBodyType) =>
    http.post<AuthTokens>(ENDPOINT_CLIENT.REFRESH, body, {
      skipAuth: true
    }),

  // call sever to refresh token
  refreshTokenServer: (body: AuthTokens) =>
    http.post<AuthTokens>(ENDPOINT_SERVER.REFRESH, body, {
      baseURL: "",
    }),
  forgotPassword: (data: ForgotPasswordBodyType) =>
    http.post<{ message: string }>(ENDPOINT_CLIENT.FORGOT_PASSWORD, data),
  resetPassword: (data: ResetPasswordBodyType) =>
    http.post<{ message: string }>(ENDPOINT_CLIENT.RESET_PASSWORD, data),
  me: () => http.get<User>(ENDPOINT_CLIENT.PROFILE),
  createUser: (data: CreateUserBodyType) => http.post<User>(ENDPOINT_CLIENT.CREATE_USER, data),
};
