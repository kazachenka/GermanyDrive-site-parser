import { app, BrowserWindow, dialog } from "electron"
import { join } from "node:path"
import { autoUpdater } from "electron-updater"
import { registerAuthIpcHandlers } from "./ipc/auth"
import { registerParseIpcHandlers } from "./ipc/parse"

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"))
  }
}

function setupAutoUpdate() {
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for update...")
  })

  autoUpdater.on("update-available", (info) => {
    console.log("Update available:", info.version)
  })

  autoUpdater.on("update-not-available", () => {
    console.log("No updates found")
  })

  autoUpdater.on("error", (err) => {
    console.error("Auto update error:", err)
  })

  autoUpdater.on("download-progress", (progress) => {
    console.log(`Download speed: ${progress.bytesPerSecond}`)
    console.log(`Downloaded: ${progress.percent}%`)
  })

  autoUpdater.on("update-downloaded", async () => {
    const result = await dialog.showMessageBox({
      type: "info",
      buttons: ["Перезапустить сейчас", "Позже"],
      defaultId: 0,
      cancelId: 1,
      title: "Обновление готово",
      message: "Новая версия приложения загружена. Перезапустить приложение сейчас?"
    })

    if (result.response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
}

app.whenReady().then(() => {
  registerParseIpcHandlers()
  registerAuthIpcHandlers()
  createWindow()

  setupAutoUpdate()

  if (!process.env.ELECTRON_RENDERER_URL) {
    autoUpdater.checkForUpdatesAndNotify()
  }
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})