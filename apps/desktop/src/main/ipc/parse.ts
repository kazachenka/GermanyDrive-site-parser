import { ipcMain } from "electron";
import { getHtmlByUrl, sentToTelegramInTestMode, sentToTelegramInProdMode } from "../services/parser-api.service";
import { ProductPostItemType } from "@site-parser/shared"

export function registerParseIpcHandlers() {
  ipcMain.handle("parse:get-html-by-url", async (_, siteUrl: string) => {
    return getHtmlByUrl(siteUrl);
  });
  ipcMain.handle("parse:sent-to-telegram-test-mode", async (_, data: ProductPostItemType) => {
    return sentToTelegramInTestMode(data);
  });
  ipcMain.handle("parse:sent-to-telegram-prod-mode", async (_, data: ProductPostItemType) => {
    return sentToTelegramInProdMode(data);
  });
}
