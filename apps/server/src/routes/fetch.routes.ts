import { Hono } from "hono";
import { AppContext } from "../types/app";

const fetchRequests = new Hono<AppContext>();

fetchRequests.post('/fetch-html', async (c) => {
	const { url } = await c.req.json<{ url: string }>()
	const SCRAPER_API_KEY = c.env?.SCRAPER_API_KEY;

	const proxyUrl = new URL('https://api.scraperapi.com');

	proxyUrl.searchParams.append('api_key', SCRAPER_API_KEY);
	proxyUrl.searchParams.append('url', url);
	// proxyUrl.searchParams.append('render', 'true');
	proxyUrl.searchParams.append('premium', 'true');
	proxyUrl.searchParams.append('country_code', 'de');

	const res = await fetch(proxyUrl.toString());

	if (!res.ok) {
		return c.json({ error: `Scraper error: ${res.status}` }, res.status);
	}

	const html = await res.text();

	return c.json(html);
})

export default fetchRequests;
