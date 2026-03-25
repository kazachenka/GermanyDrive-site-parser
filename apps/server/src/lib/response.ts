export function jsonError(c: any, message: string, status = 400) {
	return c.json({ ok: false, message }, status)
}
