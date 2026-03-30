function toHex(buffer: ArrayBuffer): string {
	return [...new Uint8Array(buffer)]
	.map((b) => b.toString(16).padStart(2, '0'))
	.join('')
}

function fromHex(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2)
	for (let i = 0; i < bytes.length; i++) {
		bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
	}
	return bytes
}

function randomHex(size = 16): string {
	const arr = new Uint8Array(size)
	crypto.getRandomValues(arr)
	return [...arr].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function sha256(input: string): Promise<string> {
	const data = new TextEncoder().encode(input)
	const digest = await crypto.subtle.digest('SHA-256', data)
	return toHex(digest)
}

async function pbkdf2(password: string, saltHex: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	)

	const bits = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: fromHex(saltHex),
			iterations: 100000,
			hash: 'SHA-256',
		},
		key,
		256
	)

	return toHex(bits)
}

export async function hashPassword(password: string) {
	const salt = randomHex(16)
	const hash = await pbkdf2(password, salt)
	return {salt, hash}
}

export async function verifyPassword(password: string, salt: string, hash: string) {
	const check = await pbkdf2(password, salt)
	return check === hash
}

export function createRefreshToken() {
	return crypto.randomUUID() + crypto.randomUUID()
}
