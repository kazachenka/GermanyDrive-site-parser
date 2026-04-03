import { Hono } from "hono";
import { userService } from "../services/user.service";
import {RegisterRequestDto, UserDto, UserPatchPassword, UserPatchTelegramId} from '@site-parser/shared'
import {registerUser} from "../services/auth.service";
import {jsonError} from "../lib/response";
import {AppContext} from "../types/app";

const userRoutes = new Hono<AppContext>();

// GET USERS
userRoutes.get("/", async (c) => {
	try {
		const users = await userService.getAllUsers(c.env);
		return c.json(users, 200);
	} catch (err) {
		console.error(err);
		return c.json({ message: "Ошибка в поиске юзеров" }, 500);
	}
});


userRoutes.patch(
	"/patch-email",
	async (c) => {
		try {
			const body = await c.req.json<UserDto>();

			const result = await userService.patchEmail(c.env, body);

			if (!result) {
				return c.json({ message: "Юзер не обнаружен" }, 404);
			}

			return c.json({ message: "email успешно обновлен" }, 200);
		} catch (err) {
			console.error(err);
			return c.json({ message: "Ошибка обновления email" }, 500);
		}
	}
);

userRoutes.patch(
	"/patch-password",
	async (c) => {
		try {
			const body = await c.req.json<UserPatchPassword>();

			const result = await userService.patchPassword(c.env, body);

			if (!result) {
				return c.json({ message: "Юзер не обнаружен" }, 404);
			}

			return c.json({ message: "Пароль был обновлен" }, 200);
		} catch (err) {
			console.error(err);
			return c.json({ message: "Ошибка при обновлении пароля" }, 500);
		}
	}
);

userRoutes.patch(
	"/patch-telegram-id",
	async (c) => {
		try {
			const body = await c.req.json<UserPatchTelegramId>();

			const result = await userService.patchTelegramId(c.env, body);

			if (!result) {
				return c.json({ message: "Юзер не обнаружен" }, 404);
			}

			return c.json({ message: "telegram id был обновлен" }, 200);
		} catch (err) {
			console.error(err);
			return c.json({ message: "Ошибка при обновлении telegram id" }, 500);
		}
	}
);


userRoutes.post(
	"/create",
	async (c) => {
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
	}
);

userRoutes.delete("/:id", async (c) => {
	try {
		const id = Number(c.req.param("id"));
		const userData = c.get('user');

		if (!Number.isInteger(id) || id <= 0) {
			return c.json({ message: "Неверный user id" }, 400);
		}

		const deleted = await userService.deleteUser(c.env, id);

		if (!deleted) {
			return c.json({ message: "Юзер не обнаружен" }, 404);
		}

		if (userData.id === id) {
			return c.json({ message: "Вы не можете удалить самого себя" }, 400);
		}

		return c.json({ message: "Юзер удален" }, 200);
	} catch (error) {
		console.error("DELETE /user/:id error:", error);
		return c.json({ message: "Ошибка при удалении пользователя" }, 500);
	}
})

export default userRoutes;
