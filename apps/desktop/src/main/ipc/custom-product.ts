import { ipcMain } from "electron";
import {
  sentToTelegramInProdMode,
  sentToTelegramInTestMode
} from "../services/custom-product-api.service";

import { CustomProductPostItemType } from "@site-parser/shared"

export function registerCustomProductIpcHandlers() {
  ipcMain.handle("custom-product:sent-to-telegram-test-mode", async (_, data: CustomProductPostItemType) => {
    return sentToTelegramInTestMode(data);
  });
  ipcMain.handle("custom-product:sent-to-telegram-prod-mode", async (_, data: CustomProductPostItemType) => {
    return sentToTelegramInProdMode(data);
  });
}