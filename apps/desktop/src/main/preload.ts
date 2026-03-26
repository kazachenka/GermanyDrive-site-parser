import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("auth", {
    setToken: (token: string) => ipcRenderer.invoke("auth:set-token", token),
    getToken: (): Promise<string | null> => ipcRenderer.invoke("auth:get-token"),
    clearToken: () => ipcRenderer.invoke("auth:clear-token")
})