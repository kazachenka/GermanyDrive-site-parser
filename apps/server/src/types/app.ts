export type Bindings = {
	DB: D1Database
	tg_temp_images: R2Bucket
	IMAGES: ImagesBinding
	JWT_SECRET: string
	TELEGRAM_BOT_TOKEN: string
	TELEGRAM_CHAT_ID: string
}
