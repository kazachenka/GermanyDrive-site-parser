import { MobileDeRuPostItemType } from "@site-parser/shared"

const API_URL = import.meta.env.VITE_API_URL;

async function mainApiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const data = await response.json();
      message = data.message ?? data.error ?? message;
    } catch {
      try {
        message = await response.text();
      } catch {
        message = "Request failed";
      }
    }

    throw new Error(message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

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
  data: MobileDeRuPostItemType
): Promise<void> {
  await mainApiFetch<void>("/telegram/sent-to-test", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function sentToTelegramInProdMode (
  data: MobileDeRuPostItemType
): Promise<void> {
  await mainApiFetch<void>("/telegram/sent-to-prod", {
    method: "POST",
    body: JSON.stringify(data),
  });
}