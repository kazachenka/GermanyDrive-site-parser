import { Hono } from 'hono'
import type { Bindings } from './types/app'
import { authRoutes } from './modules/auth'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/health', (c) => c.json({ ok: true }))
app.route('/auth', authRoutes)

export default app
