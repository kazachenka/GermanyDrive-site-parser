import { CustomProductPostItemType } from "@site-parser/shared"
import { sentDataToTelegramTest, sentDataToTelegramProd } from "./custom-product.requests.ts";

export const customProductApi = {
  async sentDataToTelegramTest(data: CustomProductPostItemType): Promise<void> {
    return await sentDataToTelegramTest(data);
  },

  async sentDataToTelegramProd(data: CustomProductPostItemType): Promise<void> {
    return await sentDataToTelegramProd(data);
  }
};