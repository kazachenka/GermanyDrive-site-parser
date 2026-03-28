import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    type PropsWithChildren,
} from "react";
import type { UserDto } from "@site-parser/shared";
import { authApi } from "../api/auth.api";
import { authReducer, initialAuthState } from "./auth.reducer";
import type { LoginPayload, RegisterPayload } from "./auth.types";
import { AUTH_ACTIONS } from "./auth.constants.ts";

type AuthContextValue = {
    user: UserDto | null;
    isLoading: boolean;
    initialized: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    fetchMe: () => Promise<void>;
    logout: () => Promise<void>;
    clearAuthError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    const login = useCallback(async (payload: LoginPayload) => {
        dispatch({ type: AUTH_ACTIONS.AUTH_REQUEST });

        try {
            const user = await authApi.login(payload);
            dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.LOGIN_FAILURE,
                payload: error instanceof Error ? error.message : "Login failed",
            });
            throw error;
        }
    }, []);

    const register = useCallback(async (payload: RegisterPayload) => {
        dispatch({ type: AUTH_ACTIONS.AUTH_REQUEST });

        try {
            const user = await authApi.register(payload);
            dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS, payload: user });
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.REGISTER_FAILURE,
                payload: error instanceof Error ? error.message : "Register failed",
            });
            throw error;
        }
    }, []);

    const fetchMe = useCallback(async () => {
        dispatch({ type: AUTH_ACTIONS.AUTH_REQUEST });

        try {
            const user = await authApi.fetchMe();
            dispatch({ type: AUTH_ACTIONS.FETCH_ME_SUCCESS, payload: user });
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.FETCH_ME_FAILURE,
                payload: error instanceof Error ? error.message : null,
            });
        }
    }, []);

    const logout = useCallback(async () => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT_REQUEST });

        try {
            await authApi.logout();
            dispatch({ type: AUTH_ACTIONS.LOGOUT_SUCCESS });
        } catch (error) {
            dispatch({
                type: AUTH_ACTIONS.LOGOUT_FAILURE,
                payload: error instanceof Error ? error.message : "Logout failed",
            });
        }
    }, []);

    const clearAuthError = useCallback(() => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_AUTH_ERROR });
    }, []);

    useEffect(() => {
        let cancelled = false;

        const bootstrapAuth = async () => {
            try {
                const hasRefreshToken = await window.auth.hasRefreshToken();

                if (cancelled) {
                    return;
                }

                if (!hasRefreshToken) {
                    dispatch({ type: AUTH_ACTIONS.AUTH_INIT_COMPLETE });
                    return;
                }

                const restored = await window.auth.refreshSession();

                if (cancelled) {
                    return;
                }

                if (!restored) {
                    dispatch({ type: AUTH_ACTIONS.AUTH_INIT_COMPLETE });
                    return;
                }

                await fetchMe();
            } catch (error) {
                console.error("[auth] bootstrap:error", error);

                if (cancelled) {
                    return;
                }

                dispatch({ type: AUTH_ACTIONS.AUTH_INIT_COMPLETE });
            }
        };

        void bootstrapAuth();

        return () => {
            cancelled = true;
        };
    }, [fetchMe]);

    const value = useMemo<AuthContextValue>(
        () => ({
            user: state.user,
            isLoading: state.isLoading,
            initialized: state.initialized,
            error: state.error,
            isAuthenticated: Boolean(state.user),
            login,
            register,
            fetchMe,
            logout,
            clearAuthError,
        }),
        [state, login, register, fetchMe, logout, clearAuthError]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}