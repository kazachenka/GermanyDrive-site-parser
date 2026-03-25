import { Hono } from 'hono'
import type { Bindings } from './types/app'
import { authRoutes } from './modules/auth'
import telegramRoutes from './modules/post-to-telegram/post-to-telegram.routes'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/health', (c) => c.json({ ok: true }))
app.route('/auth', authRoutes)
app.route('/telegram', telegramRoutes)

export default app
