import {getHtmlByUrlRequest} from "./parser.requests.ts";

export const parserApi = {
  async getSiteByUrl(siteUrl: string): Promise<string> {
    return await getHtmlByUrlRequest(siteUrl);
  },
};