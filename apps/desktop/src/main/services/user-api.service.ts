import {mainApiFetch} from "./utils/fetch.utils";
import {RegisterRequestDto, UserDto, UserPatchPassword, UserPatchTelegramId} from "@site-parser/shared";

export async function patchPassword (
  data: UserPatchPassword
): Promise<void> {
  await mainApiFetch<void>("/user/patch-password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function patchEmail (
  data: UserDto
): Promise<void> {
  await mainApiFetch<void>("/user/patch-email", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getUsers (): Promise<UserDto[]> {
  return await mainApiFetch<UserDto[]>("/user", {
    method: "GET",
  });
}

export async function createNewUser (data: RegisterRequestDto): Promise<void> {
  return await mainApiFetch<void>("/user/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function removeUser (id: number): Promise<void> {
  await mainApiFetch<void>(`/user/${id}`, {
    method: "DELETE",
  });
}

export async function patchUserTelegramId(data: UserPatchTelegramId): Promise<void> {
  await mainApiFetch<void>("/user/patch-telegram-id", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}