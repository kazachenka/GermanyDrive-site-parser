"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("auth", {
  getAccessToken: () => electron.ipcRenderer.invoke("auth:get-access-token"),
  hasRefreshToken: () => electron.ipcRenderer.invoke("auth:has-refresh-token"),
  saveSession: (session) => electron.ipcRenderer.invoke("auth:save-session", session),
  clearSession: () => electron.ipcRenderer.invoke("auth:clear-session"),
  refreshSession: () => electron.ipcRenderer.invoke("auth:refresh-session"),
  logout: () => electron.ipcRenderer.invoke("auth:logout")
});
electron.contextBridge.exposeInMainWorld("parse", {
  getHtmlByUrlForParse: (siteUrl) => electron.ipcRenderer.invoke("parse:get-html-by-url", siteUrl),
  sentToTelegramTest: (data) => electron.ipcRenderer.invoke("parse:sent-to-telegram-test-mode", data),
  sentToTelegramProd: (data) => electron.ipcRenderer.invoke("parse:sent-to-telegram-prod-mode", data)
});
