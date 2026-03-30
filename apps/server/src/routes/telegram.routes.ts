import { Hono } from 'hono'
import { AppContext } from '../types/app'
import { MobileDeRuPostItemType } from "@site-parser/shared"
import { PrintMobileDeRuService } from "../services/telegram.service";
import { findUserByEmail } from "../repositories/user.resitory";
import { getDb } from "../db";

const telegramRoutes = new Hono<AppContext>()

telegramRoutes.post('/sent-to-test', async (c) => {
	try {
		const db = getDb(c.env);
		const body = await c.req.json<MobileDeRuPostItemType>()
		const userData = c.get('user');
		const user = await findUserByEmail(db, userData.email);

		if (!user) {
			return c.json({ok: false, message: 'Вы неавторизованы'}, 401);
		}

		const printMobileDeRuService = new PrintMobileDeRuService(
			c.env.TELEGRAM_BOT_TOKEN,
			c.env.IMAGES,
		)

		await printMobileDeRuService.printItemToTgGroup(user.telegramId, body)

		return c.json({ok: true})
	} catch (error) {
		console.error('TELEGRAM SEND ERROR:', error)
		return c.json({ok: false, message: `Ошибка отправки сообщения: ${error}`}, 500);
	}
})

telegramRoutes.post('/sent-to-prod', async (c) => {
	try {
		const body = await c.req.json<MobileDeRuPostItemType>()
		const printMobileDeRuService = new PrintMobileDeRuService(
			c.env.TELEGRAM_BOT_TOKEN,
			c.env.IMAGES,
		)

		await printMobileDeRuService.printItemToTgGroup(c.env.TELEGRAM_CHAT_ID, body)

		return c.json({ok: true})
	} catch (error) {
		console.error('TELEGRAM SEND ERROR:', error)
		return c.json({ok: false, message: `Ошибка отправки сообщения: ${error}`}, 500)
	}
})

export default telegramRoutes
