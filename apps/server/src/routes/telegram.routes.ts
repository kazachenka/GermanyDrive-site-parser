import {Hono} from 'hono'
import type {Bindings} from '../types/app'
import {sendTelegramMessage} from '../lib/telegram'

const telegramRoutes = new Hono<{ Bindings: Bindings }>()

telegramRoutes.post('/send', async (c) => {
	try {
		const body = await c.req.json<{ message?: string }>()

		if (!body.message?.trim()) {
			return c.json({ok: false, message: 'message is required'}, 400)
		}

		await sendTelegramMessage({
			botToken: c.env.TELEGRAM_BOT_TOKEN,
			chatId: c.env.TELEGRAM_CHAT_ID,
			text: body.message,
		})

		return c.json({ok: true})
	} catch (error) {
		console.error('TELEGRAM SEND ERROR:', error)
		return c.json({ok: false, message: 'failed to send message'}, 500)
	}
})


export default telegramRoutes
