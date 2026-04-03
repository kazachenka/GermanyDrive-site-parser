import {mainApiFetch} from "./utils/fetch.utils";
import {UserDto, UserPatchPassword} from "@site-parser/shared";

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