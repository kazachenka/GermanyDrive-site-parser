import { MobileDeRuPostItemType } from '@site-parser/shared'
import { R2ImageService } from './r2-image.service'

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

export class PrintMobileDeRuService {
	private readonly MAX_MEDIA_CAPTION_LENGTH = 1024
	private readonly r2ImageService: R2ImageService

	constructor(
		private readonly botToken: string,
		bucket: R2Bucket,
		baseUrl: string,
	) {
		this.r2ImageService = new R2ImageService(bucket, baseUrl)
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
		auto: MobileDeRuPostItemType,
		styledPrice: string,
		price: number,
		text?: string,
	): string {
		const safeTitle = this.escapeHtml(auto.title)
		const safeUrl = this.escapeHtmlAttr(auto.url)
		const safeText = text ? this.escapeHtml(text) : ''

		const titleLine = `<b><a href="${safeUrl}">${safeTitle}</a></b>`
		const linkLine = `<b><a href="${safeUrl}">Открыть на mobile.de</a></b>`

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
		optionalLines.push('')
		optionalLines.push(linkLine)

		return this.joinAndFitHtmlLines(
			requiredLines,
			optionalLines,
			this.MAX_MEDIA_CAPTION_LENGTH,
		)
	}

	private async telegramCall(method: string, body: Record<string, unknown>) {
		const res = await fetch(`https://api.telegram.org/bot${this.botToken}/${method}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		const data = await res.json<any>()

		if (!res.ok || !data.ok) {
			throw new Error(`Telegram API error: ${JSON.stringify(data)}`)
		}

		return data
	}

	public async printItemToTgGroup(
		chatId: number | string,
		auto: MobileDeRuPostItemType,
		text?: string,
	): Promise<void> {
		const selectedUrls = auto.imageUrls?.slice(0, 10) ?? []

		if (!selectedUrls.length) {
			throw new Error('Нет фотографий для отправки')
		}

		const price = 11600
		const styledPrice = this.toStyledNumber(price)
		const caption = this.buildCaption(auto, styledPrice, price, text)

		const uploadedImages = await Promise.all(
			selectedUrls.map((url) => this.r2ImageService.uploadFromUrl(url))
		)

		console.log('uploadedImages: ', uploadedImages);

		const media = uploadedImages.map((file, index) => ({
			type: 'photo',
			media: file.url,
			...(index === 0
				? {
					caption,
					parse_mode: 'HTML',
				}
				: {}),
		}))

		await this.telegramCall('sendMediaGroup', {
			chat_id: String(chatId),
			media,
		})
	}

	public async sendTextMessage(chatId: number | string, text: string): Promise<void> {
		await this.telegramCall('sendMessage', {
			chat_id: String(chatId),
			text,
			parse_mode: 'HTML',
			disable_web_page_preview: true,
		})
	}
}
