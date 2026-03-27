import keytar from "keytar";

const SERVICE_NAME = "site-parser-desktop";
const ACCOUNT_NAME = "refresh-token";

export const secureStorageService = {
    async getRefreshToken(): Promise<string | null> {
        return keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
    },

    async setRefreshToken(token: string): Promise<void> {
        await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, token);
    },

    async clearRefreshToken(): Promise<void> {
        await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
    },
};