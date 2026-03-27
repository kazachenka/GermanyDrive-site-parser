import { ipcMain } from "electron"

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function registerAuthIpcHandlers() {
    ipcMain.handle("auth:get-token", async () => {
        return accessToken
    })

    ipcMain.handle("auth:set-token", async (_event, token: string) => {
        accessToken = token
        return true
    })

    ipcMain.handle("auth:get-refresh-token", async () => {
        return refreshToken
    })

    ipcMain.handle("auth:set-refresh-token", async (_event, token: string) => {
        refreshToken = token
        return true
    })

    ipcMain.handle("auth:clear-token", async () => {
        refreshToken = null
        accessToken = null
        return true
    })
}