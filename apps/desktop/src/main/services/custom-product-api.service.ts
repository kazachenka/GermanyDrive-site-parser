import { mainApiFetch } from "./utils/fetch.utils";
import { CustomProductPostItemType } from "@site-parser/shared"

export async function sentToTelegramInTestMode (
  data: CustomProductPostItemType
): Promise<void> {
  await mainApiFetch<void>("/telegram/sent-custom-product-to-test", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function sentToTelegramInProdMode (
  data: CustomProductPostItemType
): Promise<void> {
  await mainApiFetch<void>("/telegram/sent-custom-product-to-prod", {
    method: "POST",
    body: JSON.stringify(data),
  });
}