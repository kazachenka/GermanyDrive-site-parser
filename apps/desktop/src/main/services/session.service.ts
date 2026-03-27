import { secureStorageService } from "./secure-storage.service";

let accessToken: string | null = null;

export const sessionService = {
    getAccessToken(): string | null {
        return accessToken;
    },

    setAccessToken(token: string): void {
        accessToken = token;
    },

    clearAccessToken(): void {
        accessToken = null;
    },

    async hasRefreshToken(): Promise<boolean> {
        const refreshToken = await secureStorageService.getRefreshToken();
        return Boolean(refreshToken);
    },

    async getRefreshToken(): Promise<string | null> {
        return secureStorageService.getRefreshToken();
    },

    async saveSession(params: {
        accessToken: string;
        refreshToken: string;
    }): Promise<void> {
        accessToken = params.accessToken;
        await secureStorageService.setRefreshToken(params.refreshToken);
    },

    async clearSession(): Promise<void> {
        accessToken = null;
        await secureStorageService.clearRefreshToken();
    },
};