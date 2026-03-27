import type {
    LoginRequestDto,
    RegisterRequestDto,
    UserDto,
} from "@site-parser/shared";

export interface AuthState {
    user: UserDto | null;
    isLoading: boolean;
    initialized: boolean;
    error: string | null;
}

export type AuthAction =
    | { type: "AUTH_REQUEST" }
    | { type: "AUTH_INIT_COMPLETE" }
    | { type: "LOGIN_SUCCESS"; payload: UserDto }
    | { type: "REGISTER_SUCCESS"; payload: UserDto }
    | { type: "FETCH_ME_SUCCESS"; payload: UserDto }
    | { type: "LOGIN_FAILURE"; payload: string | null }
    | { type: "REGISTER_FAILURE"; payload: string | null }
    | { type: "FETCH_ME_FAILURE"; payload: string | null }
    | { type: "LOGOUT_REQUEST" }
    | { type: "LOGOUT_SUCCESS" }
    | { type: "LOGOUT_FAILURE"; payload: string | null }
    | { type: "CLEAR_AUTH_ERROR" };

export type LoginPayload = LoginRequestDto;
export type RegisterPayload = RegisterRequestDto;