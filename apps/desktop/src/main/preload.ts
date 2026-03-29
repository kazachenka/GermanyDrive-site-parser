import electron, {contextBridge, ipcRenderer} from "electron";

contextBridge.exposeInMainWorld("auth", {
  getAccessToken: (): Promise<string | null> =>
    ipcRenderer.invoke("auth:get-access-token"),

  hasRefreshToken: (): Promise<boolean> =>
    ipcRenderer.invoke("auth:has-refresh-token"),

  saveSession: (session: {
    accessToken: string;
    refreshToken: string;
  }): Promise<boolean> => ipcRenderer.invoke("auth:save-session", session),

  clearSession: (): Promise<boolean> =>
    ipcRenderer.invoke("auth:clear-session"),

  refreshSession: (): Promise<boolean> =>
    ipcRenderer.invoke("auth:refresh-session"),

  logout: (): Promise<boolean> => ipcRenderer.invoke("auth:logout"),
});


contextBridge.exposeInMainWorld("parse", {
  getHtmlByUrlForParse: (siteUrl: string) => electron.ipcRenderer.invoke("parse:get-html-by-url", siteUrl),
});