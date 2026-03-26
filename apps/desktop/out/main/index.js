"use strict";
const electron = require("electron");
const node_path = require("node:path");
let accessToken = null;
function registerAuthIpcHandlers() {
  electron.ipcMain.handle("auth:get-token", async () => {
    return accessToken;
  });
  electron.ipcMain.handle("auth:set-token", async (_event, token) => {
    accessToken = token;
    return true;
  });
  electron.ipcMain.handle("auth:clear-token", async () => {
    accessToken = null;
    return true;
  });
}
function createWindow() {
  const win = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: node_path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  }
}
electron.app.whenReady().then(() => {
  registerAuthIpcHandlers();
  createWindow();
});
