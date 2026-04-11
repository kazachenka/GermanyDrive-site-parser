import { app, BrowserWindow, dialog } from "electron"
import { join } from "node:path"
import { autoUpdater } from "electron-updater"
import { registerAuthIpcHandlers } from "./ipc/auth"
import { registerParseIpcHandlers } from "./ipc/parse"
import { registerVersionIpcHandlers } from "./ipc/version";
import {registerUserIpcHandlers} from "./ipc/user";

let mainWindow: BrowserWindow | null = null
let isUpdating = false

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("close", (event) => {
    if (isUpdating) {
      event.preventDefault();
    }
  })
}

function setBlockedState(blocked: boolean, title?: string) {
  isUpdating = blocked;

  if (!mainWindow) return

  mainWindow.setProgressBar(blocked ? 0 : -1);

  mainWindow.webContents.send("updater:block-ui", {
    blocked,
    title: title ?? ""
  })
}

function setupAutoUpdate() {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for update...");
  })

  autoUpdater.on("update-available", async (info) => {
    if (!mainWindow) return

    const result = await dialog.showMessageBox(mainWindow, {
      type: "info",
      buttons: ["Скачать обновление", "Позже"],
      defaultId: 0,
      cancelId: 1,
      title: "Доступно обновление",
      message: `Доступна новая версия ${info.version}.`,
      detail: "Скачать и установить обновление сейчас?"
    })

    if (result.response !== 0) {
      return;
    }

    try {
      setBlockedState(true, "Скачивание обновления...");
      await autoUpdater.downloadUpdate();
    } catch (err) {
      console.error("Download update error:", err);

      setBlockedState(false);

      await dialog.showMessageBox(mainWindow, {
        type: "error",
        title: "Ошибка обновления",
        message: "Не удалось скачать обновление.",
        detail: err instanceof Error ? err.message : String(err)
      })
    }
  })

  autoUpdater.on("update-not-available", () => {
    console.log("No updates found");
  })

  autoUpdater.on("error", async (err) => {
    if (!mainWindow) return

    setBlockedState(false)

    await dialog.showMessageBox(mainWindow, {
      type: "error",
      title: "Ошибка автообновления",
      message: "Во время проверки или загрузки обновления произошла ошибка.",
      detail: err instanceof Error ? err.message : String(err)
    })
  })

  autoUpdater.on("download-progress", (progress) => {
    if (!mainWindow) return

    mainWindow.setProgressBar(progress.percent / 100)

    mainWindow.webContents.send("updater:progress", {
      percent: progress.percent,
      bytesPerSecond: progress.bytesPerSecond,
      transferred: progress.transferred,
      total: progress.total
    })
  })

  autoUpdater.on("update-downloaded", async () => {
    if (!mainWindow) return

    setBlockedState(false)

    const result = await dialog.showMessageBox(mainWindow, {
      type: "info",
      buttons: ["Установить и перезапустить", "Позже"],
      defaultId: 0,
      cancelId: 1,
      title: "Обновление готово",
      message: "Новая версия приложения загружена.",
      detail: "Установить обновление и перезапустить приложение сейчас?"
    })

    if (result.response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
}

app.whenReady().then(() => {
  registerParseIpcHandlers();
  registerAuthIpcHandlers();
  registerVersionIpcHandlers();
  createWindow();
  setupAutoUpdate();
  registerUserIpcHandlers();

  if (!process.env.ELECTRON_RENDERER_URL) {
    void autoUpdater.checkForUpdates()
  }
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
})