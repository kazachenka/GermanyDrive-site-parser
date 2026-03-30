import type {
  LogoutRequestDto,
  RefreshRequestDto,
  RefreshResponseDto,
} from "@site-parser/shared";
import { mainApiFetch } from "./utils/fetch.utils";

export async function refreshSessionRequest(
  payload: RefreshRequestDto
): Promise<RefreshResponseDto> {
  return mainApiFetch<RefreshResponseDto>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutSessionRequest(
  payload: LogoutRequestDto
): Promise<void> {
  await mainApiFetch<void>("/auth/logout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}