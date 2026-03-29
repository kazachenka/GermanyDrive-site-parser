import {ipcMain} from "electron";
import {
  logoutSessionRequest,
  refreshSessionRequest,
} from "../services/auth-main-api.service";
import {sessionService} from "../services/session.service";

export function registerAuthIpcHandlers() {
  ipcMain.handle("auth:get-access-token", async () => {
    return sessionService.getAccessToken();
  });

  ipcMain.handle("auth:has-refresh-token", async () => {
    return sessionService.hasRefreshToken();
  });

  ipcMain.handle(
    "auth:save-session",
    async (_event, session: { accessToken: string; refreshToken: string }) => {
      await sessionService.saveSession(session);
      return true;
    }
  );

  ipcMain.handle("auth:clear-session", async () => {
    await sessionService.clearSession();
    return true;
  });

  ipcMain.handle("auth:refresh-session", async () => {
    const refreshToken = await sessionService.getRefreshToken();

    if (!refreshToken) {
      return false;
    }

    try {
      const response = await refreshSessionRequest({refreshToken});

      await sessionService.saveSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      return true;
    } catch {
      await sessionService.clearSession();
      return false;
    }
  });

  ipcMain.handle("auth:logout", async () => {
    const refreshToken = await sessionService.getRefreshToken();

    try {
      if (refreshToken) {
        await logoutSessionRequest({refreshToken});
      }
    } finally {
      await sessionService.clearSession();
    }

    return true;
  });
}