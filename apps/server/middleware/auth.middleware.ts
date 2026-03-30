import type { MiddlewareHandler } from 'hono'
import { verifyAccessToken } from "../src/lib/jwt";

export function createAuthMiddleware(): MiddlewareHandler {
	return async (c, next) => {
		const authHeader = c.req.header('Authorization')


		console.log(c.req.header())
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return c.json({ message: 'Unauthorized' }, 401)
		}

		const token = authHeader.slice(7)

		try {
			const payload = await verifyAccessToken(token, c.env.JWT_SECRET)

			// кладём payload в контекст
			c.set('user', {
				id: payload.sub,
				email: payload.email,
			})

			await next()
		} catch {
			return c.json({ message: 'Invalid or expired token' }, 401)
		}
	}
}
