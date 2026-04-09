import { getHtmlByUrlRequest, sentDataToTelegramTest, sentDataToTelegramProd } from "./parser.requests.ts";
import { MobileDeRuPostItemType } from "@site-parser/shared"

export const parserApi = {
  async getSiteByUrl(siteUrl: string): Promise<string> {
    return await getHtmlByUrlRequest(siteUrl);
  },
  async sentDataToTelegramTest(data: MobileDeRuPostItemType): Promise<void> {
    return await sentDataToTelegramTest(data);
  },

  async sentDataToTelegramProd(data: MobileDeRuPostItemType): Promise<void> {
    return await sentDataToTelegramProd(data);
  }
};