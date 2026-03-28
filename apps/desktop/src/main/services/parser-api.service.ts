export async function getHtmlByUrl(
    payload: string
): Promise<any> {
    const res = await fetch(payload, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
        },
    })

    // if (!res.ok) throw new Error(`HTTP ${res.status}`)

    return await res.text()
}