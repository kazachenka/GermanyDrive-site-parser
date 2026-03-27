import type { AuthAction, AuthState } from "./auth.types";

export const initialAuthState: AuthState = {
    user: null,
    isLoading: false,
    initialized: false,
    error: null,
};

export function authReducer(
    state: AuthState,
    action: AuthAction
): AuthState {
    switch (action.type) {
        case "AUTH_REQUEST":
        case "LOGOUT_REQUEST":
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case "AUTH_INIT_COMPLETE":
            return {
                ...state,
                initialized: true,
                isLoading: false,
                error: null,
            };

        case "LOGIN_SUCCESS":
        case "REGISTER_SUCCESS":
            return {
                ...state,
                user: action.payload,
                isLoading: false,
                initialized: true,
                error: null,
            };

        case "FETCH_ME_SUCCESS":
            return {
                ...state,
                user: action.payload,
                isLoading: false,
                initialized: true,
                error: null,
            };

        case "LOGIN_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload ?? "Login failed",
            };

        case "REGISTER_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload ?? "Register failed",
            };

        case "FETCH_ME_FAILURE":
            return {
                ...state,
                user: null,
                isLoading: false,
                initialized: true,
                error: action.payload ?? null,
            };

        case "LOGOUT_SUCCESS":
            return {
                ...state,
                user: null,
                isLoading: false,
                initialized: true,
                error: null,
            };

        case "LOGOUT_FAILURE":
            return {
                ...state,
                user: null,
                isLoading: false,
                initialized: true,
                error: action.payload ?? "Logout failed",
            };

        case "CLEAR_AUTH_ERROR":
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
}