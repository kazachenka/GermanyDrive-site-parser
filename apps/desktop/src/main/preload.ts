import electron, {contextBridge, ipcRenderer} from "electron";
import { MobileDeRuPostItemType } from "@site-parser/shared";

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
  sentToTelegramTest: (data: MobileDeRuPostItemType) => electron.ipcRenderer.invoke("parse:sent-to-telegram-test-mode", data),
  sentToTelegramProd: (data: MobileDeRuPostItemType) => electron.ipcRenderer.invoke("parse:sent-to-telegram-prod-mode", data),
});

contextBridge.exposeInMainWorld("updater", {
  onBlockUi: (callback: (payload: { blocked: boolean; title: string }) => void) => {
    ipcRenderer.on("updater:block-ui", (_event, payload) => callback(payload))
  },
  onProgress: (
    callback: (payload: {
      percent: number
      bytesPerSecond: number
      transferred: number
      total: number
    }) => void
  ) => {
    ipcRenderer.on("updater:progress", (_event, payload) => callback(payload))
  }
})