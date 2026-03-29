import {app, BrowserWindow} from "electron"
import {join} from "node:path"
import {registerAuthIpcHandlers} from "./ipc/auth"
import {registerParseIpcHandlers} from "./ipc/parse";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
}

app.whenReady().then(() => {
  registerParseIpcHandlers()
  registerAuthIpcHandlers()
  createWindow()
})