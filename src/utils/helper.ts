import { ActionType, ScopeType } from "@/lib/authz";
import { jwtDecode } from "jwt-decode";
export const decodeJWT = <T>(token: string) => {
    return jwtDecode(token) as T
}
export const permission = (
    action: ActionType,
    scope?: ScopeType
) => {
    return scope ? `${action}:${scope}` : action;
}