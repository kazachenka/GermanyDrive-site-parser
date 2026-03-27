import type {
    LoginRequestDto,
    RegisterRequestDto,
    UserDto,
} from "@site-parser/shared";
import { AUTH_ACTIONS } from "./auth.constants.ts";

export interface AuthState {
    user: UserDto | null;
    isLoading: boolean;
    initialized: boolean;
    error: string | null;
}

export type AuthActionType =
    typeof AUTH_ACTIONS[keyof typeof AUTH_ACTIONS];

export type AuthAction =
    | { type: typeof AUTH_ACTIONS.AUTH_REQUEST }
    | { type: typeof AUTH_ACTIONS.AUTH_INIT_COMPLETE }
    | { type: typeof AUTH_ACTIONS.LOGIN_SUCCESS; payload: UserDto }
    | { type: typeof AUTH_ACTIONS.LOGIN_FAILURE; payload: string | null }
    | { type: typeof AUTH_ACTIONS.REGISTER_SUCCESS; payload: UserDto }
    | { type: typeof AUTH_ACTIONS.REGISTER_FAILURE; payload: string | null }
    | { type: typeof AUTH_ACTIONS.FETCH_ME_SUCCESS; payload: UserDto }
    | { type: typeof AUTH_ACTIONS.FETCH_ME_FAILURE; payload: string | null }
    | { type: typeof AUTH_ACTIONS.LOGOUT_REQUEST }
    | { type: typeof AUTH_ACTIONS.LOGOUT_SUCCESS }
    | { type: typeof AUTH_ACTIONS.LOGOUT_FAILURE; payload: string | null }
    | { type: typeof AUTH_ACTIONS.CLEAR_AUTH_ERROR };

export type LoginPayload = LoginRequestDto;
export type RegisterPayload = RegisterRequestDto;