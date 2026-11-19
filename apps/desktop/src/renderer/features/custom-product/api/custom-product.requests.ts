import { CustomProductPostItemType } from "@site-parser/shared"

export async function sentDataToTelegramTest(data: CustomProductPostItemType): Promise<void> {
  return window.customProduct.sentToTelegramTest(data);
}

export async function sentDataToTelegramProd(data: CustomProductPostItemType): Promise<void> {
  return window.customProduct.sentToTelegramProd(data);
}