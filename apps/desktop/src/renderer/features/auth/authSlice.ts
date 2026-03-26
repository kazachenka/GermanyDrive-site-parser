import { createSlice } from "@reduxjs/toolkit"
import type { UserDto } from "@site-parser/shared"
import {
    loginThunk,
    registerThunk,
    fetchMeThunk,
    logoutThunk
} from "./authThunks"

interface AuthState {
    user: UserDto | null
    isLoading: boolean
    initialized: boolean
    error: string | null
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    initialized: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthError(state) {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.error = null
                state.initialized = true
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = (action.payload as string) ?? "Login failed"
            })

            .addCase(registerThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.error = null
                state.initialized = true
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = (action.payload as string) ?? "Register failed"
            })

            .addCase(fetchMeThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchMeThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                state.initialized = true
            })
            .addCase(fetchMeThunk.rejected, (state, action) => {
                state.isLoading = false
                state.user = null
                state.initialized = true
                state.error = (action.payload as string) ?? null
            })

            .addCase(logoutThunk.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.isLoading = false
                state.user = null
                state.error = null
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.isLoading = false
                state.user = null
                state.error = (action.payload as string) ?? "Logout failed"
            })
    }
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer