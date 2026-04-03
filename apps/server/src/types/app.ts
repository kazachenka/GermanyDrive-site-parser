export type AppContext = {
	Bindings: Bindings
	Variables: {
		user: UserContext
	}
}

export type Bindings = {
	DB: D1Database
	tg_temp_images: R2Bucket
	IMAGES: ImagesBinding
	JWT_SECRET: string
	TELEGRAM_BOT_TOKEN: string
	TELEGRAM_CHAT_ID: string
}

export type UserContext = {
	id: number
	email: string
}
