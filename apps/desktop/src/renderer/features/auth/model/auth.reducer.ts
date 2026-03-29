import type {AuthAction, AuthState} from "./auth.types";
import {AUTH_ACTIONS} from "./auth.constants.ts";

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
    case AUTH_ACTIONS.AUTH_REQUEST:
    case AUTH_ACTIONS.LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.AUTH_INIT_COMPLETE:
      return {
        ...state,
        initialized: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        initialized: true,
        error: null,
      };

    case AUTH_ACTIONS.FETCH_ME_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        initialized: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload ?? "Login failed",
      };

    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload ?? "Register failed",
      };

    case AUTH_ACTIONS.FETCH_ME_FAILURE:
      return {
        ...state,
        user: null,
        isLoading: false,
        initialized: true,
        error: action.payload ?? null,
      };

    case AUTH_ACTIONS.LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
        isLoading: false,
        initialized: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT_FAILURE:
      return {
        ...state,
        user: null,
        isLoading: false,
        initialized: true,
        error: action.payload ?? "Logout failed",
      };

    case AUTH_ACTIONS.CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}