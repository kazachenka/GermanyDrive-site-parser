import {Hono} from 'hono'
import {verifyAccessToken} from '../lib/jwt'
import {jsonError} from '../lib/response'
import type {Bindings} from '../types/app'
import type {
	LoginRequestDto,
	LogoutRequestDto,
	RefreshRequestDto,
	RegisterRequestDto,
} from '@site-parser/shared'
import {
	loginUser,
	logoutUser,
	refreshSession,
	registerUser,
} from '../services/auth.service'

const auth = new Hono<{ Bindings: Bindings }>()

auth.post('/register', async (c) => {
	const body = await c.req.json<RegisterRequestDto>()
	const result = await registerUser(c.env, body)

	if ('error' in result) {
		return jsonError(c, result.error.message, result.error.status)
	}

	return c.json(result.data)
})

auth.post('/login', async (c) => {
	const body = await c.req.json<LoginRequestDto>()
	const result = await loginUser(c.env, body)

	if ('error' in result) {
		return jsonError(c, result.error.message, result.error.status)
	}

	return c.json(result.data)
})

auth.post('/refresh', async (c) => {
	const body = await c.req.json<RefreshRequestDto>()
	const result = await refreshSession(c.env, body)

	if ('error' in result) {
		return jsonError(c, result.error.message, result.error.status)
	}

	return c.json(result.data)
})

auth.post('/logout', async (c) => {
	const body = await c.req.json<LogoutRequestDto>()
	const result = await logoutUser(c.env, body)

	if ('error' in result) {
		return jsonError(c, result.error.message, result.error.status)
	}

	return c.json(result.data)
})

auth.get('/me', async (c) => {
	const authHeader = c.req.header('Authorization')

	if (!authHeader) {
		return jsonError(c, 'Unauthorized', 401)
	}

	const [type, token] = authHeader.split(' ')

	if (type !== 'Bearer' || !token) {
		return jsonError(c, 'Unauthorized', 401)
	}

	try {
		const payload = await verifyAccessToken(token, c.env.JWT_SECRET)

		return c.json({
			ok: true,
			user: {
				id: Number(payload.sub),
				email: payload.email,
			},
		})
	} catch (error) {
		console.error('AUTH ME ERROR:', error)
		return jsonError(c, 'Unauthorized', 401)
	}
})

export default auth
