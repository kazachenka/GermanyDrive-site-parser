import { MobileDeRuPostItemType } from "@site-parser/shared"

export async function getHtmlByUrlRequest(url: string): Promise<string> {
  return window.parse.getHtmlByUrlForParse(url);
}

export async function sentDataToTelegramTest(data: MobileDeRuPostItemType): Promise<void> {
  return window.parse.sentToTelegramTest( data);
}

export async function sentDataToTelegramProd(data: MobileDeRuPostItemType): Promise<void> {
  return window.parse.sentToTelegramProd( data);
}