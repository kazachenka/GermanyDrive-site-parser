import { Hono } from 'hono'
import {AppContext, Bindings} from '../types/app'

const filesRoutes = new Hono<AppContext>()

filesRoutes.get('/:key{.+}', async (c) => {
	const key = c.req.param('key')
	const obj = await c.env.tg_temp_images.get(key)

	if (!obj) {
		return c.text('Not found', 404)
	}

	return new Response(obj.body, {
		headers: {
			'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
			'Cache-Control': 'public, max-age=300',
		},
	})
})

filesRoutes.post('/upload', async (c) => {
	const body = await c.req.parseBody();
	const file = body['file'] as File;

	if (!file) return c.json({ error: 'No file' }, 400);

	const id = crypto.randomUUID();
	const extension = file.name.split('.').pop() || 'jpg';
	const key = `tg-temp/${id}.${extension}`;

	await c.env.tg_temp_images.put(key, await file.arrayBuffer(), {
		httpMetadata: { contentType: file.type },
	});

	const publicUrl = `${c.env.R2_PUBLIC_URL}/${key}`;

	return c.json({
		success: true,
		key: key,
		url: publicUrl
	});
});

export default filesRoutes
