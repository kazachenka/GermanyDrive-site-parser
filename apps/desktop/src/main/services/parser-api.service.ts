import { ProductPostItemType } from "@site-parser/shared"
import {mainApiFetch} from "./utils/fetch.utils";

export async function getHtmlByUrl(
  payload: string
): Promise<any> {
  const res = await fetch(payload, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  })

  // if (!res.ok) throw new Error(`HTTP ${res.status}`)

  return await res.text()
}

export async function sentToTelegramInTestMode (
  data: ProductPostItemType
): Promise<void> {
  await mainApiFetch<void>("/telegram/sent-to-test", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function sentToTelegramInProdMode (
  data: ProductPostItemType
): Promise<void> {
  await mainApiFetch<void>("/telegram/sent-to-prod", {
    method: "POST",
    body: JSON.stringify(data),
  });
}