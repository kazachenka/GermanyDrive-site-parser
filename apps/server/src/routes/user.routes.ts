import { Hono } from "hono";
import { userService } from "../services/user.service";
import {UserDto, UserPatchPassword} from '@site-parser/shared'

const userRoutes = new Hono();

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

export default userRoutes;
