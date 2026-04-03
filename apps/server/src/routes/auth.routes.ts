import {Hono} from 'hono'
import {verifyAccessToken} from '../lib/jwt'
import {jsonError} from '../lib/response'
import { AppContext } from '../types/app'
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
import { getDb } from "../db";
import { findUserByEmail } from "../utils/auth.service.utils";

const auth = new Hono<AppContext>()

auth.post('/register', async (c) => {
	try {
		const body = await c.req.json<RegisterRequestDto>()
		const result = await registerUser(c.env, body)

		if ('error' in result) {
			return jsonError(c, result.error.message, result.error.status)
		}

		return c.json(result.data)
	} catch (error) {
		console.error("registration error:", error);
		return jsonError(c, `${error}`)
	}
})

auth.post('/login', async (c) => {
	try {
		const body = await c.req.json<LoginRequestDto>()
		const result = await loginUser(c.env, body)

		if ('error' in result) {
			return jsonError(c, result.error.message, result.error.status)
		}

		return c.json(result.data)
	} catch (error) {
		console.error("login error:", error);
		return jsonError(c, `${error}`)
	}
})

auth.post('/refresh', async (c) => {
	try {
		const body = await c.req.json<RefreshRequestDto>()
		const result = await refreshSession(c.env, body)

		if ('error' in result) {
			return jsonError(c, result.error.message, result.error.status)
		}

		return c.json(result.data)
	} catch (error) {
		console.error("refresh token error:", error);
		return jsonError(c, `${error}`)
	}
})

auth.post('/logout', async (c) => {
	try {
		const body = await c.req.json<LogoutRequestDto>()
		const result = await logoutUser(c.env, body)

		if ('error' in result) {
			return jsonError(c, result.error.message, result.error.status)
		}

		return c.json(result.data)
	} catch (error) {
		console.error("refresh token error:", error);
		return jsonError(c, 'Произашла ошибка с выходом из аккаунта')
	}
})

auth.get('/me', async (c) => {
	const authHeader = c.req.header('Authorization')

	if (!authHeader) {
		return jsonError(c, 'Вы неавторизованы', 401)
	}

	const [type, token] = authHeader.split(' ')

	if (type !== 'Bearer' || !token) {
		return jsonError(c, 'Вы неавторизованы', 401)
	}

	try {
		const db = getDb(c.env);
		const payload = await verifyAccessToken(token, c.env.JWT_SECRET);
		const user = await findUserByEmail(db, payload.email as string);

		return c.json({
			ok: true,
			user: {
				id: Number(payload.sub),
				email: payload.email,
				isAdmin: user.isAdmin,
			},
		})
	} catch (error) {
		console.error('AUTH ME ERROR:', error)
		return jsonError(c, 'Вы неавторизованы', 401)
	}
})

export default auth
