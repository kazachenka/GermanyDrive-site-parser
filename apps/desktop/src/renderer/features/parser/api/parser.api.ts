import {
  getHtmlByUrlRequest,
  sentDataToTelegramTest,
  sentDataToTelegramProd,
  getHtmlByUrlFromServerForParse
} from "./parser.requests.ts";
import { ProductPostItemType } from "@site-parser/shared"

export const parserApi = {
  async getSiteByUrl(siteUrl: string, needVpn: boolean): Promise<string> {
    if (needVpn) {
      return await getHtmlByUrlFromServerForParse(siteUrl);
    }

    return await getHtmlByUrlRequest(siteUrl);
  },
  async sentDataToTelegramTest(data: ProductPostItemType): Promise<void> {
    return await sentDataToTelegramTest(data);
  },

  async sentDataToTelegramProd(data: ProductPostItemType): Promise<void> {
    return await sentDataToTelegramProd(data);
  }
};