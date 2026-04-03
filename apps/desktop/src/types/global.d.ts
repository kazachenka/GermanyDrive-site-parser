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

    user: {
      patchUserEmail(data: import('@site-parser/shared').UserDto): Promise<void>;
      patchUserPassword(data: import('@site-parser/shared').UserPatchPassword): Promise<void>;
      getUsers(): Promise<import('@site-parser/shared').UserDto[]>;
    }

    appInfo: {
      getVersion: () => Promise<string>
    }

    updater: {
      onBlockUi: (
        callback: (payload: { blocked: boolean; title: string }) => void
      ) => () => void
      onProgress: (
        callback: (payload: {
          percent: number
          bytesPerSecond: number
          transferred: number
          total: number
        }) => void
      ) => () => void
    }
  }
}