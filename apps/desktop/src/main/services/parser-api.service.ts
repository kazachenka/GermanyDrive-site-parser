import { net } from 'electron'

import { ProductPostItemType } from "@site-parser/shared"
import { mainApiFetch } from "./utils/fetch.utils";

export async function getHtmlByUrl(
  payload: string
): Promise<any> {
  const res = await net.fetch(payload, {
    method: 'GET',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
      'Sec-Ch-Ua':
        '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    },
  })

  // if (!res.ok) throw new Error(`HTTP ${res.status}`)

  return await res.text()
}

export async function getHtmlByUrlFromWorker (
  url: string
): Promise<any> {
  return await mainApiFetch<void>("/fetch/fetch-html", {
    method: "POST",
    body: JSON.stringify({
      url: url,
    }),
  });
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