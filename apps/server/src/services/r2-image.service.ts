export class R2ImageService {
	constructor(
		private readonly bucket: R2Bucket,
		private readonly publicBaseUrl: string,
	) {}

	buildKey(ext = 'jpg') {
		return `tg-temp/${Date.now()}-${crypto.randomUUID()}.${ext}`
	}

	async uploadFromUrl(imageUrl: string) {
		const resp = await fetch(imageUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0',
				'Accept': 'image/*,*/*;q=0.8',
			},
		})

		if (!resp.ok) {
			throw new Error(`Failed to fetch image: ${imageUrl}`)
		}

		const contentType = resp.headers.get('content-type') || 'image/jpeg'
		const bytes = await resp.arrayBuffer()
		const ext = contentType.includes('png') ? 'png' : 'jpg'
		const key = this.buildKey(ext)

		await this.bucket.put(key, bytes, {
			httpMetadata: { contentType },
		})

		return {
			key,
			url: `${this.publicBaseUrl}/files/${encodeURIComponent(key)}`,
			contentType,
		}
	}

	async get(key: string) {
		return this.bucket.get(key)
	}

	async delete(key: string) {
		return this.bucket.delete(key)
	}
}
