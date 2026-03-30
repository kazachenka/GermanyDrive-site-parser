type CleanupOptions = {
	prefix: string
	ttlMs: number
	listLimit?: number
	deleteBatchSize?: number
	nowMs?: number
}

type CleanupResult = {
	scanned: number
	deleted: number
}

export async function cleanupTempImages(
	bucket: R2Bucket,
	options: CleanupOptions,
): Promise<CleanupResult> {
	const now = options.nowMs ?? Date.now()
	const listLimit = options.listLimit ?? 1000
	const deleteBatchSize = options.deleteBatchSize ?? 50

	let cursor: string | undefined = undefined
	let scanned = 0
	let deleted = 0

	do {
		const page = await bucket.list({
			prefix: options.prefix,
			cursor,
			limit: listLimit,
		})

		scanned += page.objects.length

		let deleteBatch: Promise<void>[] = []

		for (const obj of page.objects) {
			const uploadedAt = new Date(obj.uploaded).getTime()
			const isExpired = now - uploadedAt > options.ttlMs

			if (!isExpired) continue

			deleteBatch.push(bucket.delete(obj.key))
			deleted++

			if (deleteBatch.length >= deleteBatchSize) {
				await Promise.all(deleteBatch)
				deleteBatch = []
			}
		}

		if (deleteBatch.length > 0) {
			await Promise.all(deleteBatch)
		}

		cursor = page.truncated ? page.cursor : undefined
	} while (cursor)

	const result: CleanupResult = { scanned, deleted }
	console.log('cleanup finished', result)

	return result
}
