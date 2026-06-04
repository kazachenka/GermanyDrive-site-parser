import { sessionService } from "../session.service";

const API_URL = process.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export async function mainApiFetch<T>(
  path: string,
  options: RequestInit = {},
  retryOn401 = true
): Promise<T> {
  try {
    const token =
      sessionService.getAccessToken();

    const headers = new Headers(
      options.headers
    );

    if (token) {
      headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }

    const response = await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data?.message ??
        "Request failed"
      );
    }

    return data;
  } catch (error) {
    const isUnauthorized =
      error instanceof ApiError &&
      error.status === 401;

    const isRefreshRequest =
      path === "/auth/refresh";

    if (
      isUnauthorized &&
      retryOn401 &&
      !isRefreshRequest
    ) {
      const refreshed =
        await sessionService.refreshOnce();

      if (refreshed) {
        return mainApiFetch(
          path,
          options,
          false
        );
      }
    }

    throw error;
  }
}