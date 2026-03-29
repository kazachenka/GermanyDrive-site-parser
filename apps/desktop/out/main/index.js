"use strict";
const electron = require("electron");
const node_path = require("node:path");
const keytar = require("keytar");
const API_URL$1 = "https://site-parser-api.kazachenkovova2001.workers.dev/";
async function mainApiFetch$1(path, options = {}) {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_URL$1}${path}`, {
    ...options,
    headers
  });
  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.message ?? data.error ?? message;
    } catch {
      try {
        message = await response.text();
      } catch {
        message = "Request failed";
      }
    }
    throw new Error(message || "Request failed");
  }
  if (response.status === 204) {
    return void 0;
  }
  return response.json();
}
async function refreshSessionRequest(payload) {
  return mainApiFetch$1("/auth/refresh", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
async function logoutSessionRequest(payload) {
  await mainApiFetch$1("/auth/logout", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
const SERVICE_NAME = "site-parser-desktop";
const ACCOUNT_NAME = "refresh-token";
const secureStorageService = {
  async getRefreshToken() {
    return keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
  },
  async setRefreshToken(token) {
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, token);
  },
  async clearRefreshToken() {
    await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
  }
};
let accessToken = null;
const sessionService = {
  getAccessToken() {
    return accessToken;
  },
  setAccessToken(token) {
    accessToken = token;
  },
  clearAccessToken() {
    accessToken = null;
  },
  async hasRefreshToken() {
    const refreshToken = await secureStorageService.getRefreshToken();
    return Boolean(refreshToken);
  },
  async getRefreshToken() {
    return secureStorageService.getRefreshToken();
  },
  async saveSession(params) {
    accessToken = params.accessToken;
    await secureStorageService.setRefreshToken(params.refreshToken);
  },
  async clearSession() {
    accessToken = null;
    await secureStorageService.clearRefreshToken();
  }
};
function registerAuthIpcHandlers() {
  electron.ipcMain.handle("auth:get-access-token", async () => {
    return sessionService.getAccessToken();
  });
  electron.ipcMain.handle("auth:has-refresh-token", async () => {
    return sessionService.hasRefreshToken();
  });
  electron.ipcMain.handle(
    "auth:save-session",
    async (_event, session) => {
      await sessionService.saveSession(session);
      return true;
    }
  );
  electron.ipcMain.handle("auth:clear-session", async () => {
    await sessionService.clearSession();
    return true;
  });
  electron.ipcMain.handle("auth:refresh-session", async () => {
    const refreshToken = await sessionService.getRefreshToken();
    if (!refreshToken) {
      return false;
    }
    try {
      const response = await refreshSessionRequest({ refreshToken });
      await sessionService.saveSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      });
      return true;
    } catch {
      await sessionService.clearSession();
      return false;
    }
  });
  electron.ipcMain.handle("auth:logout", async () => {
    const refreshToken = await sessionService.getRefreshToken();
    try {
      if (refreshToken) {
        await logoutSessionRequest({ refreshToken });
      }
    } finally {
      await sessionService.clearSession();
    }
    return true;
  });
}
const API_URL = "https://site-parser-api.kazachenkovova2001.workers.dev/";
async function mainApiFetch(path, options = {}) {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });
  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.message ?? data.error ?? message;
    } catch {
      try {
        message = await response.text();
      } catch {
        message = "Request failed";
      }
    }
    throw new Error(message || "Request failed");
  }
  if (response.status === 204) {
    return void 0;
  }
  return response.json();
}
async function getHtmlByUrl(payload) {
  const res = await fetch(payload, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });
  return await res.text();
}
async function sentToTelegramInTestMode(data) {
  await mainApiFetch("/telegram/sent-to-test", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
async function sentToTelegramInProdMode(data) {
  await mainApiFetch("/telegram/sent-to-prod", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
function registerParseIpcHandlers() {
  electron.ipcMain.handle("parse:get-html-by-url", async (_, siteUrl) => {
    return getHtmlByUrl(siteUrl);
  });
  electron.ipcMain.handle("parse:sent-to-telegram-test-mode", async (_, data) => {
    return sentToTelegramInTestMode(data);
  });
  electron.ipcMain.handle("parse:sent-to-telegram-prod-mode", async (_, data) => {
    return sentToTelegramInProdMode(data);
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
  if (!electron.app.isPackaged) {
    win.webContents.openDevTools();
  }
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(node_path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  registerParseIpcHandlers();
  registerAuthIpcHandlers();
  createWindow();
});
