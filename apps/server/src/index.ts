import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { eq, and, isNull, gt } from 'drizzle-orm'
import {jwt, verify} from 'hono/jwt'
import { sign } from 'hono/jwt'
import { sessions, users } from './db/schema'

type Bindings = {
	DB: D1Database
	JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// ---------- utils ----------

function jsonError(c: any, message: string, status = 400) {
	return c.json({ ok: false, message }, status)
}

function toHex(buffer: ArrayBuffer): string {
	return [...new Uint8Array(buffer)]
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
}

function fromHex(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
	}
	return bytes
}

function randomHex(size = 16): string {
	const arr = new Uint8Array(size)
	crypto.getRandomValues(arr)
	return [...arr].map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function sha256(input: string): Promise<string> {
	const data = new TextEncoder().encode(input)
	const digest = await crypto.subtle.digest('SHA-256', data)
	return toHex(digest)
}

async function pbkdf2(password: string, saltHex: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	)

	const bits = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: fromHex(saltHex),
			iterations: 310000,
			hash: 'SHA-256',
		},
		key,
		256
	)

	return toHex(bits)
}

async function hashPassword(password: string) {
	const salt = randomHex(16)
	const hash = await pbkdf2(password, salt)
	return { salt, hash }
}

async function verifyPassword(password: string, salt: string, hash: string) {
	const check = await pbkdf2(password, salt)
	return check === hash
}

function createRefreshToken() {
	return crypto.randomUUID() + crypto.randomUUID()
}

async function createAccessToken(
	user: { id: number; email: string },
	secret: string
) {
	const now = Math.floor(Date.now() / 1000)

	return sign(
		{
			sub: String(user.id),
			email: user.email,
			exp: now + 60 * 15,
		},
		secret,
		'HS256'
	)
}

// ---------- routes ----------

app.get('/health', (c) => c.json({ ok: true }))

// ---------- REGISTER ----------

app.post('/auth/register', async (c) => {
	const db = drizzle(c.env.DB)

	const { email, password } = await c.req.json<{
		email?: string
		password?: string
	}>()

	if (!email || !password) {
		return jsonError(c, 'email and password required')
	}

	if (password.length < 8) {
		return jsonError(c, 'password must be >= 8 chars')
	}

	const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)

	if (existing.length > 0) {
		return jsonError(c, 'user already exists', 409)
	}

	const { salt, hash } = await hashPassword(password)

	const now = new Date().toISOString()

	const inserted = await db
		.insert(users)
		.values({
			email,
			passwordHash: hash,
			passwordSalt: salt,
			createdAt: now,
			updatedAt: now,
		})
		.returning({ id: users.id, email: users.email })

	const user = inserted[0]

	const accessToken = await createAccessToken(user, c.env.JWT_SECRET)

	const refreshToken = createRefreshToken()
	const refreshTokenHash = await sha256(refreshToken)

	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()

	await db.insert(sessions).values({
		userId: user.id,
		refreshTokenHash,
		expiresAt,
		revokedAt: null,
		createdAt: now,
	})

	return c.json({
		ok: true,
		user,
		accessToken,
		refreshToken,
	})
})

// ---------- LOGIN ----------

app.post('/auth/login', async (c) => {
	const db = drizzle(c.env.DB)

	const { email, password } = await c.req.json<{
		email?: string
		password?: string
	}>()

	if (!email || !password) {
		return jsonError(c, 'invalid credentials', 401)
	}

	const found = await db.select().from(users).where(eq(users.email, email)).limit(1)

	if (found.length === 0) {
		return jsonError(c, 'invalid credentials', 401)
	}

	const user = found[0]

	const valid = await verifyPassword(password, user.passwordSalt, user.passwordHash)

	if (!valid) {
		return jsonError(c, 'invalid credentials', 401)
	}

	const accessToken = await createAccessToken(
		{ id: user.id, email: user.email },
		c.env.JWT_SECRET
	)

	const refreshToken = createRefreshToken()
	const refreshTokenHash = await sha256(refreshToken)

	const now = new Date().toISOString()

	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()

	await db.insert(sessions).values({
		userId: user.id,
		refreshTokenHash,
		expiresAt,
		revokedAt: null,
		createdAt: now,
	})

	return c.json({
		ok: true,
		user: {
			id: user.id,
			email: user.email,
		},
		accessToken,
		refreshToken,
	})
})

// ---------- REFRESH ----------

app.post('/auth/refresh', async (c) => {
	const db = drizzle(c.env.DB)

	const { refreshToken } = await c.req.json<{ refreshToken?: string }>()

	if (!refreshToken) {
		return jsonError(c, 'refresh token required')
	}

	const hash = await sha256(refreshToken)

	const now = new Date().toISOString()

	const session = await db
		.select()
		.from(sessions)
		.where(
			and(
				eq(sessions.refreshTokenHash, hash),
				isNull(sessions.revokedAt),
				gt(sessions.expiresAt, now)
			)
		)
		.limit(1)

	if (session.length === 0) {
		return jsonError(c, 'invalid refresh token', 401)
	}

	const s = session[0]

	const user = await db.select().from(users).where(eq(users.id, s.userId)).limit(1)

	const u = user[0]

	// revoke old
	await db.update(sessions).set({ revokedAt: now }).where(eq(sessions.id, s.id))

	// new tokens
	const newRefresh = createRefreshToken()
	const newHash = await sha256(newRefresh)

	const newExpires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()

	await db.insert(sessions).values({
		userId: u.id,
		refreshTokenHash: newHash,
		expiresAt: newExpires,
		revokedAt: null,
		createdAt: now,
	})

	const accessToken = await createAccessToken(
		{ id: u.id, email: u.email },
		c.env.JWT_SECRET
	)

	return c.json({
		ok: true,
		accessToken,
		refreshToken: newRefresh,
	})
})

// ---------- LOGOUT ----------

app.post('/auth/logout', async (c) => {
	const db = drizzle(c.env.DB)

	const { refreshToken } = await c.req.json<{ refreshToken?: string }>()

	if (!refreshToken) return c.json({ ok: true })

	const hash = await sha256(refreshToken)

	await db
		.update(sessions)
		.set({ revokedAt: new Date().toISOString() })
		.where(eq(sessions.refreshTokenHash, hash))

	return c.json({ ok: true })
})

// ---------- PROTECTED ----------

app.get('/auth/me', async (c) => {
	const authHeader = c.req.header('Authorization')

	if (!authHeader) {
		return c.json({ ok: false, message: 'Unauthorized' }, 401)
	}

	const [type, token] = authHeader.split(' ')

	if (type !== 'Bearer' || !token) {
		return c.json({ ok: false, message: 'Unauthorized' }, 401)
	}

	try {
		const payload = await verify(token, c.env.JWT_SECRET, 'HS256')

		return c.json({
			ok: true,
			user: {
				id: Number(payload.sub),
				email: payload.email,
			},
		})
	} catch (error) {
		console.error('AUTH ME ERROR:', error)
		return c.json({ ok: false, message: 'Unauthorized' }, 401)
	}
})

export default app
