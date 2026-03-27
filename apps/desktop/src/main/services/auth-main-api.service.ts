import type {
    LogoutRequestDto,
    RefreshRequestDto,
    RefreshResponseDto,
} from "@site-parser/shared";

const API_URL = import.meta.env.VITE_API_URL;

async function mainApiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const headers = new Headers(options.headers);

    console.log(API_URL)

    if (!(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
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

export async function refreshSessionRequest(
    payload: RefreshRequestDto
): Promise<RefreshResponseDto> {
    return mainApiFetch<RefreshResponseDto>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function logoutSessionRequest(
    payload: LogoutRequestDto
): Promise<void> {
    await mainApiFetch<void>("/auth/logout", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}