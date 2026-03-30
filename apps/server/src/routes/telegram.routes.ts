import { Hono } from 'hono'
import type { Bindings } from '../types/app'
import { MobileDeRuPostItemType } from "@site-parser/shared"
import { PrintMobileDeRuService } from "../services/telegram.service";

const telegramRoutes = new Hono<{ Bindings: Bindings }>()

telegramRoutes.post('/sent-to-test', async (c) => {
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
		return c.json({ok: false, message: 'failed to send message'}, 500)
	}
})

telegramRoutes.post('/sent-to-prod', async (c) => {
	try {
		const body = await c.req.json<{ data: MobileDeRuPostItemType }>()

		return c.json({ok: true})
	} catch (error) {
		console.error('TELEGRAM SEND ERROR:', error)
		return c.json({ok: false, message: 'failed to send message'}, 500)
	}
})

export default telegramRoutes
