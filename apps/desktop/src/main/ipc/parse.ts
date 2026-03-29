import {ipcMain} from "electron";
import {getHtmlByUrl} from "../services/parser-api.service";

export function registerParseIpcHandlers() {
  ipcMain.handle("parse:get-html-by-url", async (_, siteUrl: string) => {
    return getHtmlByUrl(siteUrl);
  });
}