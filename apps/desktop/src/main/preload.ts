import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("auth", {
    setAccessToken: (token: string) => ipcRenderer.invoke("auth:set-token", token),
    getAccessToken: (): Promise<string | null> => ipcRenderer.invoke("auth:get-token"),
    setRefreshToken: (token: string) => ipcRenderer.invoke("auth:set-refresh-token", token),
    getRefreshToken: (): Promise<string | null> => ipcRenderer.invoke("auth:get-refresh-token"),
    clearToken: () => ipcRenderer.invoke("auth:clear-token")
})