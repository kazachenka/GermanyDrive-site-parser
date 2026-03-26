import { Hono } from 'hono'
import type { Bindings } from './types/app'

import telegramRoutes from './routes/post-to-telegram.routes'
import authRoutes from "./routes/auth.routes";
import { corsMiddleware } from "../middleware/cors";

const app = new Hono<{ Bindings: Bindings }>()

app.use(
	"*",
	corsMiddleware
);

app.get('/health', (c) => c.json({ ok: true }));
app.route('/auth', authRoutes);
app.route('/telegram', telegramRoutes);

export default app;
