import { create } from "zustand";
import { decodeJWT } from "@/utils/helper";
import { User } from "@/types/user";

interface SessionState {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;

    setSession: (params: {
        accessToken: string;
        refreshToken: string;
    }) => void;

    updateSession: (params: {
        accessToken: string;
        refreshToken: string;
    }) => void;


    clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    accessToken: null,
    refreshToken: null,
    user: null,

    /* ===== INIT / LOGIN ===== */
    setSession: ({ accessToken, refreshToken }) => {
        try {
            const user = decodeJWT<User>(accessToken);
            set({
                accessToken,
                refreshToken,
                user,
            });
        } catch (error) {
            console.error("Invalid access token", error);
            set({
                accessToken: null,
                refreshToken: null,
                user: null,
            });
        }
    },
    updateSession: ({ accessToken, refreshToken }) => {
        try {
            set({
                accessToken,
                refreshToken
            })
        } catch (error) {
            console.error("Invalid access token", error);
            set({
                accessToken: null,
                refreshToken: null,
                user: null,
            });
        }
    },
    /* ===== LOGOUT / EXPIRED ===== */
    clearSession: () => {
        set({
            accessToken: null,
            refreshToken: null,
            user: null,
        });
    },
}));
