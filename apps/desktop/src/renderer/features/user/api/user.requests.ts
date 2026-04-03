import {UserDto, UserPatchPassword} from "@site-parser/shared";

export async function patchUserEmail(user: UserDto): Promise<void> {
  return window.user.patchUserEmail(user);
}

export async function patchUserPassword(user: UserPatchPassword): Promise<void> {
  return window.user.patchUserPassword(user);
}

export function getUsers(): Promise<UserDto[]> {
  return window.user.getUsers();
}