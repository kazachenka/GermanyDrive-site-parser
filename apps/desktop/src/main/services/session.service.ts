import { secureStorageService } from "./secure-storage.service";
import { refreshSessionRequest } from "./auth-main-api.service";
import { BrowserWindow } from "electron";

let accessToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

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

  async refreshOnce(): Promise<boolean> {
    if (!refreshPromise) {
      refreshPromise = this.refreshSession()
      .finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  },

  async refreshSession(): Promise<boolean> {
    const refreshToken =
      await secureStorageService.getRefreshToken();

    if (!refreshToken) {
      return false;
    }

    try {
      const response =
        await refreshSessionRequest({
          refreshToken,
        });

      accessToken = response.accessToken;

      await secureStorageService.setRefreshToken(
        response.refreshToken
      );

      return true;
    } catch {
      await this.expiredRefreshToken();
      return false;
    }
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

  async expiredRefreshToken(): Promise<void> {
    accessToken = null;
    await secureStorageService.clearRefreshToken();

    const mainWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];

    if (mainWindow) {

      mainWindow.webContents.send("auth:force-logout");
    }
  }
};