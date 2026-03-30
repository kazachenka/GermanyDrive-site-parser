export {}

declare global {
  interface Window {
    auth: {
      getAccessToken(): Promise<string | null>
      hasRefreshToken(): Promise<boolean>
      saveSession(session: {
        accessToken: string
        refreshToken: string
      }): Promise<boolean>
      clearSession(): Promise<boolean>
      refreshSession(): Promise<boolean>
      logout(): Promise<boolean>
    }

    parse: {
      getHtmlByUrlForParse(siteUrl: string): Promise<string>
      sentToTelegramTest(data: import('@site-parser/shared').MobileDeRuPostItemType): Promise<void>
      sentToTelegramProd(data: import('@site-parser/shared').MobileDeRuPostItemType): Promise<void>
    }
  }
}