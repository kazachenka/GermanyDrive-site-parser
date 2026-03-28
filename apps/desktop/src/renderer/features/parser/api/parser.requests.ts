export async function getHtmlByUrlRequest(url: string): Promise<string> {
    return window.parse.getHtmlByUrlForParse(url);
}