import type {
    LoginRequestDto,
    LoginResponseDto,
    MeResponseDto,
    RegisterRequestDto,
    RegisterResponseDto,
} from "@site-parser/shared";

const API_URL = import.meta.env.VITE_API_URL;

async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
    withAuth = true
): Promise<T> {
    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (withAuth) {
        const token = await window.auth.getAccessToken();

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let message = "Request failed";

        try {
            const data = await response.json();
            message = data.message ?? data.error ?? message;
        } catch {
            try {
                message = await response.text();
            } catch {
                message = "Request failed";
            }
        }

        throw new Error(message || "Request failed");
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export function loginRequest(data: LoginRequestDto) {
    return apiFetch<LoginResponseDto>(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify(data),
        },
        false
    );
}

export function registerRequest(data: RegisterRequestDto) {
    return apiFetch<RegisterResponseDto>(
        "/auth/register",
        {
            method: "POST",
            body: JSON.stringify(data),
        },
        false
    );
}

export function getMeRequest() {
    return apiFetch<MeResponseDto>("/auth/me");
}