import {ipcMain} from "electron";
import {getHtmlByUrl, sentToTelegramInTestMode, sentToTelegramInProdMode} from "../services/parser-api.service";
import { MobileDeRuPostItemType } from "@site-parser/shared"

export function registerParseIpcHandlers() {
  ipcMain.handle("parse:get-html-by-url", async (_, siteUrl: string) => {
    return getHtmlByUrl(siteUrl);
  });
  ipcMain.handle("parse:sent-to-telegram-test-mode", async (_, data: MobileDeRuPostItemType) => {
    return sentToTelegramInTestMode(data);
  });
  ipcMain.handle("parse:sent-to-telegram-prod-mode", async (_, data: MobileDeRuPostItemType) => {
    return sentToTelegramInProdMode(data);
  });
}
