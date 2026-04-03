import { Hono } from 'hono'
import {AppContext, Bindings, UserContext} from './types/app'

import telegramRoutes from './routes/telegram.routes'
import authRoutes from './routes/auth.routes'

import { corsMiddleware } from '../middleware/cors'
import { cleanupTempImages } from './jobs/cleanup-temp-images.job'
import filesRoutes from "./routes/file.routes";
import { createAuthMiddleware } from "../middleware/auth.middleware";
import userRoutes from "./routes/user.routes";

const app = new Hono<AppContext>()

app.use('*', corsMiddleware)

app.get('/', (c) => c.text('ok'))
app.get('/health', (c) => c.json({ ok: true }))


app.use('/telegram/*', createAuthMiddleware())
app.use('/telegram/*', createAuthMiddleware())
app.use('/files/*', createAuthMiddleware())

app.route('/auth', authRoutes)
app.route('/telegram', telegramRoutes)
app.route('/files', filesRoutes)
app.route('/user', userRoutes)

export default {
	async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
		return app.fetch(request, env, ctx)
	},

	async scheduled(controller: ScheduledController, env: Bindings) {
		if (controller.cron === '0 0 * * *') {
				await cleanupTempImages(env.tg_temp_images, {
				prefix: 'tg-temp/',
				ttlMs: 24 * 60 * 60 * 1000,
				listLimit: 1000,
				deleteBatchSize: 50,
			})
		}
	},
}
