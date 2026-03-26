import { ipcMain } from "electron"

let accessToken: string | null = null

export function registerAuthIpcHandlers() {
    ipcMain.handle("auth:get-token", async () => {
        return accessToken
    })

    ipcMain.handle("auth:set-token", async (_event, token: string) => {
        accessToken = token
        return true
    })

    ipcMain.handle("auth:clear-token", async () => {
        accessToken = null
        return true
    })
}