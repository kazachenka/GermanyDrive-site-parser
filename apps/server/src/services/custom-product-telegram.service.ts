import { CustomProductPostItemType } from '@site-parser/shared'
import { COUNTRY_CODE_TO_FLAG } from "../types/country.service.types";

type PreparedTelegramPhoto = {
	blob: Blob;
	filename: string;
	sourceUrl: string;
	index: number;
}

export class PrintCustomProductService {
	private readonly MAX_TELEGRAM_PHOTO_BYTES = 10 * 1024 * 1024;
	private readonly images: ImagesBinding;

	constructor(
		private readonly botToken: string,
		images: ImagesBinding,
	) {
		this.images = images;
	}

	private buildCustomProductTelegramCaption(data: CustomProductPostItemType): string {
		const header = data.flag ? `${COUNTRY_CODE_TO_FLAG[data.flag]} <b>${data.title}</b>` : `<b>${data.title}</b>`;

		const lines = [
			header,
			''
		];

		if (data.packageContents?.trim()) lines.push(`🗂 Комплектация: ${data.packageContents}`);
		if (data.register?.trim()) lines.push(`📅 Регистрация: ${data.register}`);
		if (data.distance?.trim()) lines.push(`🛣 Пробег: ${data.distance}`);
		if (data.engine?.trim()) lines.push(`⛽️ Двигатель: ${data.engine}`);
		if (data.power?.trim()) lines.push(`🐎 Мощность: ${data.power}`);
		if (data.transmission?.trim()) lines.push(`🕹 Коробка: ${data.transmission}`);
		if (data.drive?.trim()) lines.push(`⚙️ Привод: ${data.drive}`);
		if (data.color?.trim()) lines.push(`🎨 Цвет: ${data.color}`);

		if (data.comment?.trim()) {
			lines.push('', `${data.comment.trim()}`);
		}

		if (data.price) {
			lines.push(
				'',
				'➖ ➖ ➖ ➖ ➖ ➖ ➖',
				`🔥 <b>ЦЕНА АВТОМОБИЛЯ С ДОСТАВКОЙ ДО МИНСКА: ${data.price}</b>`,
				'➖ ➖ ➖ ➖ ➖ ➖ ➖'
			);
		}

		lines.push(
			'',
			'ℹ️ Таможенные платежи и услуги брокера в стоимость не входят.'
		);

		return lines.join('\n');
	}

	private async telegramCall(
		method: string,
		body: BodyInit,
		headers?: HeadersInit,
	) {
		const res = await fetch(`https://api.telegram.org/bot${this.botToken}/${method}`, {
			method: 'POST',
			headers,
			body,
		});

		const data = await res.json<any>();

		if (!res.ok || !data.ok) {
			throw new Error(`Telegram API error: ${JSON.stringify(data)}`);
		}

		return data;
	}

	private async fetchImageAsTelegramJpeg(
		url: string,
		index: number,
	): Promise<PreparedTelegramPhoto> {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
		}

		const inputContentType = (res.headers.get('content-type') ?? '').toLowerCase();
		const inputBytes = await res.arrayBuffer();

		if (!inputBytes.byteLength) {
			throw new Error(`Image is empty: ${url}`);
		}

		const transformed = await this.images
		.input(new Blob([inputBytes], { type: inputContentType || 'application/octet-stream' }).stream())
		.output({
			format: 'image/jpeg',
			quality: 90,
		});

		const transformedResponse = transformed.response();

		if (!transformedResponse.ok) {
			throw new Error(`Images binding failed for index=${index}, url=${url}`);
		}

		const jpegBytes = await transformedResponse.arrayBuffer();

		if (!jpegBytes.byteLength) {
			throw new Error(`Converted JPEG is empty for index=${index}, url=${url}`);
		}

		if (jpegBytes.byteLength > this.MAX_TELEGRAM_PHOTO_BYTES) {
			throw new Error(
				`Converted JPEG is too large for Telegram: ${jpegBytes.byteLength} bytes, url=${url}`,
			)
		}

		const blob = new Blob([jpegBytes], { type: 'image/jpeg' });

		return {
			blob,
			filename: `image-${index}.jpg`,
			sourceUrl: url,
			index,
		}
	}

	private async prepareTelegramPhotos(urls: string[]): Promise<PreparedTelegramPhoto[]> {
		const settled = await Promise.allSettled(
			urls.map((url, index) => this.fetchImageAsTelegramJpeg(url, index)),
		);

		const validPhotos: PreparedTelegramPhoto[] = [];

		for (const result of settled) {
			if (result.status === 'fulfilled') {
				validPhotos.push(result.value);
			} else {
				console.error('Failed to prepare Telegram image:', result.reason);
			}
		}

		return validPhotos;
	}

	public async printItemToTgGroup(
		chatId: number | string,
		auto: CustomProductPostItemType,
	): Promise<void> {
		try {
			const selectedUrls = auto.imageUrls?.slice(0, 10) ?? [];
			const text = this.buildCustomProductTelegramCaption(auto);
			const preparedPhotos = await this.prepareTelegramPhotos(selectedUrls);

			if (preparedPhotos.length > 1) {
				const form = new FormData();
				form.set('chat_id', String(chatId));

				const media = preparedPhotos.map((_, index) => ({
					type: 'photo',
					media: `attach://photo${index}`,
				}));

				form.set('media', JSON.stringify(media));

				preparedPhotos.forEach((photo, index) => {
					form.set(`photo${index}`, photo.blob, photo.filename);
				});

				await this.telegramCall('sendMediaGroup', form);
			}

			if (preparedPhotos.length === 1) {
				const form = new FormData();
				form.set('chat_id', String(chatId));
				form.set('photo', preparedPhotos[0].blob, preparedPhotos[0].filename);

				await this.telegramCall('sendPhoto', form);
			}

			await this.sendTextMessage(chatId, text);
		} catch (error) {
			console.error('Failed to post item to Telegram:', error);
		}
	}

	public async sendTextMessage(chatId: number | string, text: string): Promise<void> {
		await this.telegramCall(
			'sendMessage',
			JSON.stringify({
				chat_id: String(chatId),
				text,
				parse_mode: 'HTML',
				disable_web_page_preview: true,
			}),
			{
				'Content-Type': 'application/json',
			},
		);
	}
}
