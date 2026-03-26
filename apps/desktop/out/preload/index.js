"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("auth", {
  setToken: (token) => electron.ipcRenderer.invoke("auth:set-token", token),
  getToken: () => electron.ipcRenderer.invoke("auth:get-token"),
  clearToken: () => electron.ipcRenderer.invoke("auth:clear-token")
});
