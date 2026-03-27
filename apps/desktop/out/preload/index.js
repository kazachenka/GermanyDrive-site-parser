"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("auth", {
  setAccessToken: (token) => electron.ipcRenderer.invoke("auth:set-token", token),
  getAccessToken: () => electron.ipcRenderer.invoke("auth:get-token"),
  setRefreshToken: (token) => electron.ipcRenderer.invoke("auth:set-refresh-token", token),
  getRefreshToken: () => electron.ipcRenderer.invoke("auth:get-refresh-token"),
  clearToken: () => electron.ipcRenderer.invoke("auth:clear-token")
});
