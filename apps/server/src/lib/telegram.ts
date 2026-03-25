export async function sendTelegramMessage(params: {
	botToken: string
	chatId: string
	text: string
}) {
	const res = await fetch(
		`https://api.telegram.org/bot${params.botToken}/sendMessage`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chat_id: params.chatId,
				text: params.text,
			}),
		}
	)

	const data = await res.json<any>()

	if (!res.ok || !data.ok) {
		throw new Error(data?.description || 'Telegram send failed')
	}

	return data
}
