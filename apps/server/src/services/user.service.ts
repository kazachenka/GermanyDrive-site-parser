
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import {RegisterRequestDto, UserDto, UserPatchPassword, UserPatchTelegramId} from "@site-parser/shared";
import { hashPassword } from "../lib/crypto";
import { getDb } from "../db";
import type { Bindings } from "../types/app";

export const userService = {
	async getAllUsers(env: Bindings): Promise<UserDto[]> {
		const db = getDb(env);

		return db
		.select({
			id: users.id,
			email: users.email,
			isAdmin: users.isAdmin,
			telegramId: users.telegramId,
		})
		.from(users);
	},

	async patchEmail(env: Bindings, data: UserDto) {
		const db = getDb(env);
		const existing = await db
		.select()
		.from(users)
		.where(eq(users.email, data.email));

		if (existing.length && existing[0].id !== data.id) {
			throw new Error("Такой емаил уже существует");
		}

		const result = await db
		.update(users)
		.set({
			email: data.email,
			updatedAt: new Date().toISOString(),
		})
		.where(eq(users.id, data.id));

		return result;
	},

	async patchPassword(env: Bindings, data: UserPatchPassword ) {
		const { salt, hash } = await hashPassword(data.password);
		const db = getDb(env);

		const result = await db
		.update(users)
		.set({
			passwordHash: hash,
			passwordSalt: salt,
			updatedAt: new Date().toISOString(),
		})
		.where(eq(users.id, data.id));

		return result;
	},

	async patchTelegramId(env: Bindings, data: UserPatchTelegramId ) {
		const db = getDb(env);

		const result = await db
		.update(users)
		.set({
			telegramId: data.telegramId,
			updatedAt: new Date().toISOString(),
		})
		.where(eq(users.id, data.id));

		return result;
	},

	async deleteUser(env: Bindings, id: number) {
		const db = getDb(env);
		const existing = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.id, id));

		if (existing.length === 0) {
			return false;
		}

		await db.delete(users).where(eq(users.id, id));

		return true;
	},
};
