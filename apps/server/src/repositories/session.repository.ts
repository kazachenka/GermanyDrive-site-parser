import { and, eq, gt, isNull } from 'drizzle-orm'
import { sessions } from '../db/schema'

export async function createSession(db: any, data: {
	userId: number
	refreshTokenHash: string
	expiresAt: string
	revokedAt: string | null
	createdAt: string
}) {
	await db.insert(sessions).values(data)
}

export async function findActiveSession(db: any, hash: string, now: string) {
	const result = await db
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

	return result[0] ?? null
}

export async function revokeSession(db: any, id: number, now: string) {
	await db.update(sessions).set({ revokedAt: now }).where(eq(sessions.id, id))
}

export async function revokeByToken(db: any, hash: string, now: string) {
	await db
		.update(sessions)
		.set({ revokedAt: now })
		.where(eq(sessions.refreshTokenHash, hash))
}
