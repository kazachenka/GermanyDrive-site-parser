import { ProductPostItemType } from '@site-parser/shared'
import {PRINT_TELEGRAM_LABEL} from "../constants";

const STYLED_NUMBERS: Record<number, string> = {
	0: '0️⃣',
	1: '1️⃣',
	2: '2️⃣',
	3: '3️⃣',
	4: '4️⃣',
	5: '5️⃣',
	6: '6️⃣',
	7: '7️⃣',
	8: '8️⃣',
	9: '9️⃣',
}

type PreparedTelegramPhoto = {
	blob: Blob
	filename: string
	sourceUrl: string
	index: number
}

export class PrintMobileDeRuService {
	private readonly MAX_MEDIA_CAPTION_LENGTH = 2048
	private readonly MAX_TELEGRAM_PHOTO_BYTES = 10 * 1024 * 1024
	private readonly images: ImagesBinding

	constructor(
		private readonly botToken: string,
		images: ImagesBinding,
	) {
		this.images = images
	}

	private escapeHtml(text: string): string {
		return String(text ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
	}

	private escapeHtmlAttr(text: string): string {
		return String(text ?? '')
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
	}

	private toStyledNumber(value: number | string): string {
		return String(value ?? '')
		.split('')
		.map((char) => {
			const digit = Number(char)
			return Number.isInteger(digit) && char >= '0' && char <= '9'
				? STYLED_NUMBERS[digit]
				: char
		})
		.join('')
	}

	private trimPlainText(text: string, maxLength: number): string {
		if (text.length <= maxLength) return text
		if (maxLength <= 1) return text.slice(0, maxLength)
		return `${text.slice(0, maxLength - 1)}…`
	}

	private joinAndFitHtmlLines(
		requiredLines: string[],
		optionalLines: string[],
		maxLength: number,
	): string {
		const resultLines = [...requiredLines]

		for (const line of optionalLines) {
			const candidate = [...resultLines, line].join('\n')
			if (candidate.length <= maxLength) {
				resultLines.push(line)
				continue
			}

			if (!line.includes('<') && !line.includes('>')) {
				const current = resultLines.join('\n')
				const remaining = maxLength - current.length - 1
				if (remaining > 1) {
					resultLines.push(this.trimPlainText(line, remaining))
				}
			}
			break
		}

		return resultLines.join('\n')
	}

	private buildCaption(
		auto: ProductPostItemType,
		styledPrice: string,
		price: number,
		text?: string,
	): string {
		const safeTitle = this.escapeHtml(auto.title)
		const safeUrl = this.escapeHtmlAttr(auto.url)
		const safeText = text ? this.escapeHtml(text) : ''

		const titleLine = `<b><a href="${safeUrl}">${safeTitle}</a></b>`

		const requiredLines: string[] = [titleLine, '']
		const optionalLines: string[] = []

		if (auto.register) optionalLines.push(`🗓 ${this.escapeHtml(auto.register)}`)
		if (auto.engine) optionalLines.push(`🛠️ ${this.escapeHtml(auto.engine)}`)
		if (auto.transmission) optionalLines.push(`⚙️ ${this.escapeHtml(auto.transmission)}`)
		if (auto.power) optionalLines.push(`🏇 ${this.escapeHtml(auto.power.replace('PS', 'ЛС'))}`)
		if (auto.distance) optionalLines.push(`⏱️ ${this.escapeHtml(auto.distance)}`)
		if (auto.fuel) optionalLines.push(`⚡️ ${this.escapeHtml(auto.fuel)}`)

		if (price) {
			optionalLines.push('')
			optionalLines.push(`Ориентировочная стоимость под ключ 🔑 в Беларуси составит <b>${styledPrice}€</b>.`)
			optionalLines.push('Цена указана без учета торга с продавцом.')
			optionalLines.push('(Расчет производился под 140 указ)')
		}

		if (safeText) {
			optionalLines.push('')
			optionalLines.push(safeText)
		}

		optionalLines.push('')
		optionalLines.push('*Если Вам понравился данный автомобиль, либо хотите получить бесплатную консультацию, обращайтесь к нам - @germanydrive')
		optionalLines.push('')
		optionalLines.push('☎️ +375(29)164-99-99')
		optionalLines.push('')
		optionalLines.push('*GermanyDrive не является продавцом транспортного средства. Транспортное средство приобретается покупателем у третьего лица на территории иностранного государства.')

		if (safeUrl) {
			const linkLabel = this.getLinkLabel(safeUrl)

			if (linkLabel) {
				const linkLine = `<b><a href="${safeUrl}">Открыть на ${linkLabel}</a></b>`;

				optionalLines.push('')
				optionalLines.push(linkLine)
			}
		}

		return this.joinAndFitHtmlLines(
			requiredLines,
			optionalLines,
			this.MAX_MEDIA_CAPTION_LENGTH,
		)
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
		})

		const data = await res.json<any>()

		if (!res.ok || !data.ok) {
			throw new Error(`Telegram API error: ${JSON.stringify(data)}`)
		}

		return data
	}

	private async fetchImageAsTelegramJpeg(
		url: string,
		index: number,
	): Promise<PreparedTelegramPhoto> {
		const res = await fetch(url)

		if (!res.ok) {
			throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`)
		}

		const inputContentType = (res.headers.get('content-type') ?? '').toLowerCase()
		const inputBytes = await res.arrayBuffer()

		if (!inputBytes.byteLength) {
			throw new Error(`Image is empty: ${url}`)
		}

		const transformed = await this.images
		.input(new Blob([inputBytes], { type: inputContentType || 'application/octet-stream' }).stream())
		.output({
			format: 'image/jpeg',
			quality: 90,
		})

		const transformedResponse = transformed.response()

		if (!transformedResponse.ok) {
			throw new Error(`Images binding failed for index=${index}, url=${url}`)
		}

		const jpegBytes = await transformedResponse.arrayBuffer()

		if (!jpegBytes.byteLength) {
			throw new Error(`Converted JPEG is empty for index=${index}, url=${url}`)
		}

		if (jpegBytes.byteLength > this.MAX_TELEGRAM_PHOTO_BYTES) {
			throw new Error(
				`Converted JPEG is too large for Telegram: ${jpegBytes.byteLength} bytes, url=${url}`,
			)
		}

		const blob = new Blob([jpegBytes], { type: 'image/jpeg' })

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
		)

		const validPhotos: PreparedTelegramPhoto[] = []

		for (const result of settled) {
			if (result.status === 'fulfilled') {
				validPhotos.push(result.value)
			} else {
				console.error('Failed to prepare Telegram image:', result.reason)
			}
		}

		return validPhotos
	}

	private getLinkLabel(url: string): string | undefined {
		return Object.values(PRINT_TELEGRAM_LABEL).find(siteLink =>
			url.includes(siteLink)
		);
	}

	public async printItemToTgGroup(
		chatId: number | string,
		auto: ProductPostItemType,
		text?: string,
	): Promise<void> {
		try {
			const selectedUrls = auto.imageUrls?.slice(0, 10) ?? []

			if (!selectedUrls.length) {
				throw new Error('Нет фотографий для отправки')
			}

			const styledPrice = this.toStyledNumber(Number(auto.price))
			const caption = this.buildCaption(auto, styledPrice, Number(auto.price), text)

			const preparedPhotos = await this.prepareTelegramPhotos(selectedUrls)

			if (!preparedPhotos.length) {
				throw new Error('Не удалось подготовить изображения для Telegram')
			}

			const form = new FormData()
			form.set('chat_id', String(chatId))

			const media = preparedPhotos.map((photo, index) => ({
				type: 'photo',
				media: `attach://photo${index}`,
				...(index === 0
					? {
						caption,
						parse_mode: 'HTML',
					}
					: {}),
			}))

			form.set('media', JSON.stringify(media))

			preparedPhotos.forEach((photo, index) => {
				form.set(`photo${index}`, photo.blob, photo.filename)
			})

			await this.telegramCall('sendMediaGroup', form)
		} catch (error) {
			console.error(error)
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
		)
	}
}
