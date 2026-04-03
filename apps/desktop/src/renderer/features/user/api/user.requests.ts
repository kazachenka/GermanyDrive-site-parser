import { RegisterRequestDto, UserDto, UserPatchPassword, UserPatchTelegramId } from "@site-parser/shared";

export async function patchUserEmail(user: UserDto): Promise<void> {
  return window.user.patchUserEmail(user);
}

export async function patchUserPassword(user: UserPatchPassword): Promise<void> {
  return window.user.patchUserPassword(user);
}

export async function getUsers(): Promise<UserDto[]> {
  return window.user.getUsers();
}

export async function createNewUser(data: RegisterRequestDto): Promise<void> {
  return window.user.createUser(data);
}

export async function deleteUser(id: number): Promise<void> {
  return window.user.removeUser(id);
}

export async function updateTelegramId(data: UserPatchTelegramId): Promise<void> {
  return window.user.updateTelegramId(data);
}