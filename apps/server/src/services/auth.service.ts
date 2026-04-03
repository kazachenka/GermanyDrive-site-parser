import {getDb} from '../db'
import {createAccessToken} from '../lib/jwt'
import {
	createRefreshToken,
	hashPassword,
	sha256,
	verifyPassword,
} from '../lib/crypto'
import type {Bindings} from '../types/app'
import type {
	LoginRequestDto,
	LogoutRequestDto,
	RefreshRequestDto,
	RegisterRequestDto,
} from '@site-parser/shared'
import {createUser} from "../repositories/user.resitory";
import {createSession, findActiveSession, revokeByToken, revokeSession} from "../repositories/session.repository";
import {findUserByEmail, findUserById} from "../utils/auth.service.utils";

function getNowIso() {
	return new Date().toISOString()
}

function getRefreshExpiresIso() {
	return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
}

export async function registerUser(
	env: Bindings,
	payload: RegisterRequestDto
) {
	const db = getDb(env)
	const {email, password} = payload

	if (!email || !password) {
		return {error: {message: 'email and password required', status: 400}}
	}

	if (password.length < 8) {
		return {error: {message: 'password must be >= 8 chars', status: 400}}
	}

	const existing = await findUserByEmail(db, email)
	if (existing) {
		return {error: {message: 'user already exists', status: 409}}
	}

	const {salt, hash} = await hashPassword(password)
	const now = getNowIso()

	const user = await createUser(db, {
		email,
		passwordHash: hash,
		passwordSalt: salt,
		createdAt: now,
		updatedAt: now,
		isAdmin: false,
	})

	const accessToken = await createAccessToken(user, env.JWT_SECRET)
	const refreshToken = createRefreshToken()
	const refreshTokenHash = await sha256(refreshToken)

	await createSession(db, {
		userId: user.id,
		refreshTokenHash,
		expiresAt: getRefreshExpiresIso(),
		revokedAt: null,
		createdAt: now,
	})

	return {
		data: {
			ok: true as const,
			user,
			accessToken,
			refreshToken,
		},
	}
}

export async function loginUser(
	env: Bindings,
	payload: LoginRequestDto
) {
	const db = getDb(env)
	const {email, password} = payload

	if (!email || !password) {
		return {error: {message: 'email and password required', status: 401}}
	}

	const user = await findUserByEmail(db, email)

	if (!user) {
		return {error: {message: 'invalid credentials', status: 401}}
	}

	const valid = await verifyPassword(password, user.passwordSalt, user.passwordHash)
	if (!valid) {
		return {error: {message: 'invalid credentials', status: 401}}
	}

	const accessToken = await createAccessToken(
		{id: user.id, email: user.email},
		env.JWT_SECRET
	)

	const refreshToken = createRefreshToken()
	const refreshTokenHash = await sha256(refreshToken)
	const now = getNowIso()

	await createSession(db, {
		userId: user.id,
		refreshTokenHash,
		expiresAt: getRefreshExpiresIso(),
		revokedAt: null,
		createdAt: now,
	})

	return {
		data: {
			ok: true as const,
			user: {
				id: user.id,
				email: user.email,
				isAdmin: user.isAdmin,
			},
			accessToken,
			refreshToken,
		},
	}
}

export async function refreshSession(
	env: Bindings,
	payload: RefreshRequestDto
) {
	const db = getDb(env)

	if (!payload.refreshToken) {
		return {error: {message: 'refresh token required', status: 400}}
	}

	const refreshTokenHash = await sha256(payload.refreshToken)
	const now = getNowIso()

	const session = await findActiveSession(db, refreshTokenHash, now)
	if (!session) {
		return {error: {message: 'invalid refresh token', status: 401}}
	}

	const user = await findUserById(db, session.userId)
	if (!user) {
		return {error: {message: 'user not found', status: 404}}
	}

	await revokeSession(db, session.id, now)

	const newRefreshToken = createRefreshToken()
	const newRefreshTokenHash = await sha256(newRefreshToken)

	await createSession(db, {
		userId: user.id,
		refreshTokenHash: newRefreshTokenHash,
		expiresAt: getRefreshExpiresIso(),
		revokedAt: null,
		createdAt: now,
	})

	const accessToken = await createAccessToken(
		{id: user.id, email: user.email},
		env.JWT_SECRET
	)

	return {
		data: {
			ok: true as const,
			accessToken,
			refreshToken: newRefreshToken,
		},
	}
}

export async function logoutUser(
	env: Bindings,
	payload: LogoutRequestDto
) {
	const db = getDb(env)

	if (!payload.refreshToken) {
		return {data: {ok: true as const}}
	}

	const refreshTokenHash = await sha256(payload.refreshToken)

	await revokeByToken(db, refreshTokenHash, getNowIso())

	return {data: {ok: true as const}}
}
