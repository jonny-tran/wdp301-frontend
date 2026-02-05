import { create } from "zustand"
import { decodeJWT } from "@/utils/helper"
import { User } from "@/types/user"


interface SessionState {
    accessToken: string | null
    user: User | null
    refreshToken: string | null

    setSession: (accessToken: string, refreshToken: string) => void
    setAccessToken: (accessToken: string) => void
    clearSession: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
    accessToken: null,
    user: null,
    refreshToken: null,

    setSession: (accessToken: string, refreshToken: string) => {
        try {
            const decodedUser = decodeJWT<User>(accessToken)
            set({
                accessToken,
                refreshToken,
                user: decodedUser,
            })
        } catch (error) {
            console.error("Invalid access token", error)
            set({
                accessToken: null,
                refreshToken: null,
                user: null,
            })
        }
    },

    setAccessToken: (accessToken: string) => {
        try {
            const decodedUser = decodeJWT<User>(accessToken)
            set({
                accessToken,
                user: decodedUser,
            })
        } catch (error) {
            console.error("Invalid access token", error)
            set({
                accessToken: null,
                user: null,
            })
        }
    },

    clearSession: () => {
        set({
            accessToken: null,
            refreshToken: null,
            user: null,
        })
    },
}))