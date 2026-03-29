import { Hono } from 'hono'
import type { Bindings } from '../types/app'

const filesRoutes = new Hono<{ Bindings: Bindings }>()

filesRoutes.get('/:key{.+}', async (c) => {
	const key = c.req.param('key')
	const obj = await c.env.R2.get(key)

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

export default filesRoutes
