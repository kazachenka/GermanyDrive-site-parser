import {app} from "electron";
import {ipcMain} from "electron";

export function registerVersionIpcHandlers() {
  ipcMain.handle("app:get-version", () => {
    return app.getVersion()
  })
}