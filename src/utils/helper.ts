import { jwtDecode } from "jwt-decode";
export const decodeJWT = <T>(token: string) => {
    return jwtDecode(token) as T
}