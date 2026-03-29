import {sign, verify} from 'hono/jwt'

export async function createAccessToken(
	user: { id: number; email: string },
	secret: string
) {
	const now = Math.floor(Date.now() / 1000)

	return sign(
		{
			sub: String(user.id),
			email: user.email,
			exp: now + 60 * 15,
		},
		secret,
		'HS256'
	)
}

export async function verifyAccessToken(token: string, secret: string) {
	return verify(token, secret, 'HS256')
}
