import { getHtmlByUrlRequest, sentDataToTelegramTest, sentDataToTelegramProd } from "./parser.requests.ts";
import { ProductPostItemType } from "@site-parser/shared"

export const parserApi = {
  async getSiteByUrl(siteUrl: string): Promise<string> {
    return await getHtmlByUrlRequest(siteUrl);
  },
  async sentDataToTelegramTest(data: ProductPostItemType): Promise<void> {
    return await sentDataToTelegramTest(data);
  },

  async sentDataToTelegramProd(data: ProductPostItemType): Promise<void> {
    return await sentDataToTelegramProd(data);
  }
};