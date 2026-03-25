import { and, eq, gt, isNull } from 'drizzle-orm'
import { sessions, users } from '../../db/schema'

export async function findUserByEmail(db: any, email: string) {
	const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
	return result[0] ?? null
}

export async function findUserById(db: any, id: number) {
	const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
	return result[0] ?? null
}

export async function createUser(
	db: any,
	data: {
		email: string
		passwordHash: string
		passwordSalt: string
		createdAt: string
		updatedAt: string
	}
) {
	const result = await db
		.insert(users)
		.values(data)
		.returning({ id: users.id, email: users.email })

	return result[0]
}

export async function createSession(
	db: any,
	data: {
		userId: number
		refreshTokenHash: string
		expiresAt: string
		revokedAt: string | null
		createdAt: string
	}
) {
	await db.insert(sessions).values(data)
}

export async function findActiveSessionByRefreshTokenHash(
	db: any,
	refreshTokenHash: string,
	now: string
) {
	const result = await db
		.select()
		.from(sessions)
		.where(
			and(
				eq(sessions.refreshTokenHash, refreshTokenHash),
				isNull(sessions.revokedAt),
				gt(sessions.expiresAt, now)
			)
		)
		.limit(1)

	return result[0] ?? null
}

export async function revokeSessionById(db: any, sessionId: number, revokedAt: string) {
	await db.update(sessions).set({ revokedAt }).where(eq(sessions.id, sessionId))
}

export async function revokeSessionByRefreshTokenHash(
	db: any,
	refreshTokenHash: string,
	revokedAt: string
) {
	await db
		.update(sessions)
		.set({ revokedAt })
		.where(eq(sessions.refreshTokenHash, refreshTokenHash))
}
