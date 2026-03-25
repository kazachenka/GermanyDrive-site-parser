import { Hono } from 'hono'
import type { Bindings } from './types/app'

import telegramRoutes from './routes/post-to-telegram.routes'
import authRoutes from "./routes/auth.routes";

const app = new Hono<{ Bindings: Bindings }>()

app.get('/health', (c) => c.json({ ok: true }))
app.route('/auth', authRoutes)
app.route('/telegram', telegramRoutes)

export default app
