import {
    LoginRequestDto,
    RegisterRequestDto,
    UserDto,
    RegisterResponseDto,
    LoginResponseDto
} from "@site-parser/shared"

const API_URL = import.meta.env.VITE_API_URL;

async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
    withAuth = true
): Promise<T> {
    const headers = new Headers(options.headers)

    if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json")
    }

    if (withAuth) {
        const token = await window.auth.getAccessToken()

        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers
    })

    if (!response.ok) {
        let message = "Request failed";

        try {
            const data = await response.json()
            message = data.message ?? data.error ?? message
        } catch {
            message = await response.text()
        }

        throw new Error(message || "Request failed")
    }

    return response.json() as Promise<T>
}

export function loginRequest(data: LoginRequestDto) {
    return apiFetch<LoginResponseDto>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
    }, false)
}

export function registerRequest(data: RegisterRequestDto) {
    return apiFetch<RegisterResponseDto>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    }, false)
}

export function getMeRequest() {
    return apiFetch<UserDto>("/auth/me")
}

export async function logoutRequest() {
    const refreshToken = await window.auth.getRefreshToken();

    return apiFetch<{ success: boolean }>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({
            refreshToken: refreshToken ?? null
        })
    })
}