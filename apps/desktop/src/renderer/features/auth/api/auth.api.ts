import type {
    LoginRequestDto,
    RegisterRequestDto,
    UserDto,
} from "@site-parser/shared";
import { getMeRequest, loginRequest, registerRequest } from "./auth.requests";

export const authApi = {
    async login(data: LoginRequestDto): Promise<UserDto> {
        const response = await loginRequest(data);

        await window.auth.saveSession({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
        });

        return response.user;
    },

    async register(data: RegisterRequestDto): Promise<UserDto> {
        const response = await registerRequest(data);

        await window.auth.saveSession({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
        });

        return response.user;
    },

    async fetchMe(): Promise<UserDto> {
        const response = await getMeRequest();
        return response.user;
    },

    async logout(): Promise<void> {
        await window.auth.logout();
    },
};