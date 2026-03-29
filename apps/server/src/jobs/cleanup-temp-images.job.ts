type CleanupOptions = {
	prefix: string
	ttlMs: number
	listLimit: number
	maxDeletePerRun: number
}

export async function cleanupTempImages(
	bucket: R2Bucket,
	ctx: ExecutionContext,
	options: CleanupOptions,
) {
	const now = Date.now()
	let cursor: string | undefined = undefined
	let deleted = 0
	let scanned = 0

	do {
		const page = await bucket.list({
			prefix: options.prefix,
			cursor,
			limit: options.listLimit,
		})

		scanned += page.objects.length

		for (const obj of page.objects) {
			const uploadedAt = new Date(obj.uploaded).getTime()

			if (now - uploadedAt > options.ttlMs) {
				ctx.waitUntil(bucket.delete(obj.key))
				deleted++

				if (deleted >= options.maxDeletePerRun) {
					console.log('cleanup stopped early', {
						scanned,
						deleted,
						nextCursor: page.cursor,
					})
					return
				}
			}
		}

		cursor = page.truncated ? page.cursor : undefined
	} while (cursor)

	console.log('cleanup finished', { scanned, deleted })
}
