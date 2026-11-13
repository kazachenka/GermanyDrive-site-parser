import { Hono } from "hono";
import { AppContext } from "../types/app";

const fetchRequests = new Hono<AppContext>();

// fetchRequests.post('/fetch-html', async (c) => {
// 	const { url } = await c.req.json<{ url: string }>()
// 	const SCRAPER_API_KEY = c.env?.SCRAPER_API_KEY;
//
// 	const proxyUrl = new URL('https://api.scraperapi.com');
//
// 	proxyUrl.searchParams.append('api_key', SCRAPER_API_KEY);
// 	proxyUrl.searchParams.append('url', url);
// 	// proxyUrl.searchParams.append('render', 'true');
// 	proxyUrl.searchParams.append('premium', 'false');
//
// 	const res = await fetch(proxyUrl.toString());
//
// 	if (!res.ok) {
// 		return c.json({ error: `Scraper error: ${res.status}` }, res.status);
// 	}
//
// 	const html = await res.text();
//
// 	return c.json(html);
// })

fetchRequests.post('/fetch-html', async (c) => {
	try {
		const { url } = await c.req.json<{ url: string }>();

		if (!url) {
			return c.json({ error: 'URL is required in body' }, 400);
		}

		console.log('Incoming URL to parse:', url);

		const cacheUrl = new URL(`https://internal-cache.local/fetch-html?target=${encodeURIComponent(url)}`);
		const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
		const cache = caches.default;

		const cachedResponse = await cache.match(cacheKey);
		if (cachedResponse) {
			console.log('Cache HIT for URL:', url);
			const cachedData = await cachedResponse.json();
			return c.json(cachedData);
		}

		console.log('Cache MISS for URL. Fetching from ZenRows:', url);

		const ZENROWS_API_KEY = c.env?.ZENROWS_API_KEY;

		const proxyUrl = new URL('https://api.zenrows.com/v1/');
		proxyUrl.searchParams.append('apikey', ZENROWS_API_KEY);
		proxyUrl.searchParams.append('url', url);
		proxyUrl.searchParams.append('premium_proxy', 'true');
		proxyUrl.searchParams.append('proxy_country', 'de');

		const res = await fetch(proxyUrl.toString());

		if (!res.ok) {
			const errorText = await res.text();
			console.error('ZenRows error text:', errorText);
			return c.json({ error: `ZenRows error: ${res.status}`, details: errorText }, res.status as any);
		}

		const html = await res.text();

		const responseToCache = new Response(JSON.stringify(html), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'public, max-age=86400',
			},
		});

		c.executionCtx.waitUntil(cache.put(cacheKey, responseToCache));

		return c.json(html);

	} catch (err: any) {
		console.error('CRITICAL ERROR IN /fetch-html:', err.stack || err.message);
		return c.json({ error: 'Internal Server Error', details: err.message }, 500);
	}
});

export default fetchRequests;
