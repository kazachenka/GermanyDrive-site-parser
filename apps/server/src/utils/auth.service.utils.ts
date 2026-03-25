import {users} from "../db/schema";
import {eq} from "drizzle-orm";

export async function findUserByEmail(db: any, email: string) {
	const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
	return result[0] ?? null
}

export async function findUserById(db: any, id: number) {
	const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
	return result[0] ?? null
}
