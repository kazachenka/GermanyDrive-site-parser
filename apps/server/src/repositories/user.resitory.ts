import {eq} from 'drizzle-orm'
import {users} from '../db/schema'


export async function findUserByEmail(db: any, email: string) {
	const result = await db
	.select()
	.from(users)
	.where(eq(users.email, email))
	.limit(1)

	return result[0] ?? null
}

export async function createUser(db: any, data: {
	email: string
	passwordHash: string
	passwordSalt: string
	createdAt: string
	updatedAt: string
	isAdmin: boolean
}) {
	const result = await db
	.insert(users)
	.values(data)
	.returning({id: users.id, email: users.email, isAdmin: users.isAdmin})

	return result[0]
}

export async function findUserById(db: any, id: number) {
	const result = await db
	.select()
	.from(users)
	.where(eq(users.id, id))
	.limit(1)

	return result[0] ?? null
}
