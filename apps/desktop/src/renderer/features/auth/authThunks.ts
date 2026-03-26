import { createAsyncThunk } from "@reduxjs/toolkit"
import type { LoginRequestDto, RegisterRequestDto } from '@site-parser/shared'
import {
    loginRequest,
    registerRequest,
    getMeRequest,
    logoutRequest
} from "./authApi"

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    return "Unknown error"
}

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (data: LoginRequestDto, { rejectWithValue }) => {
        try {
            const response = await loginRequest(data)
            await window.auth.setToken(response.accessToken)
            return response.user
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const registerThunk = createAsyncThunk(
    "auth/register",
    async (data: RegisterRequestDto, { rejectWithValue }) => {
        try {
            const response = await registerRequest(data)
            await window.auth.setToken(response.accessToken)
            return response.user
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchMeThunk = createAsyncThunk(
    "auth/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            const token = await window.auth.getToken()

            if (!token) {
                return null
            }

            const user = await getMeRequest()
            return user
        } catch (error) {
            await window.auth.clearToken()
            return rejectWithValue(getErrorMessage(error))
        }
    }
)

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            try {
                await logoutRequest()
            } catch {
                // локально все равно выходим
            }

            await window.auth.clearToken()
            return null
        } catch (error) {
            return rejectWithValue(getErrorMessage(error))
        }
    }
)