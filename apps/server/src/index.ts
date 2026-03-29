import { Hono } from 'hono'
import type { Bindings } from './types/app'

import telegramRoutes from './routes/telegram.routes'
import authRoutes from './routes/auth.routes'

import { corsMiddleware } from '../middleware/cors'
import { cleanupTempImages } from './jobs/cleanup-temp-images.job'
import filesRoutes from "./routes/file.routes";

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', corsMiddleware)

app.get('/', (c) => c.text('ok'))
app.get('/health', (c) => c.json({ ok: true }))

app.route('/auth', authRoutes)
app.route('/telegram', telegramRoutes)
app.route('/files', filesRoutes)

export default {
	async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
		return app.fetch(request, env, ctx)
	},

	async scheduled(controller: ScheduledController, env: Bindings, ctx: ExecutionContext) {
		if (controller.cron === '* * * * *') {
			await cleanupTempImages(env.R2, ctx, {
				prefix: 'tg-temp/',
				ttlMs: 60 * 60 * 1000,
				listLimit: 1000,
				maxDeletePerRun: 300,
			})
		}
	},
}
