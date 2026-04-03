import {
  createNewUser,
  deleteUser,
  getUsers,
  patchUserEmail,
  patchUserPassword,
  updateTelegramId
} from "./user.requests.ts";
import {RegisterRequestDto, UserDto, UserPatchPassword, UserPatchTelegramId} from "@site-parser/shared";

export const userApi = {
  async getAllUsers(): Promise<UserDto[]> {
    return await getUsers();
  },
  async patchEmail(data: UserDto): Promise<void> {
    return await patchUserEmail(data);
  },

  async patchPassword(data: UserPatchPassword): Promise<void> {
    return await patchUserPassword(data);
  },

  async createUser(data: RegisterRequestDto): Promise<void> {
    return await createNewUser(data);
  },

  async deleteUser(id: number) {
    return await deleteUser(id);
  },

  async patchTelegramId(data: UserPatchTelegramId): Promise<void> {
    return await updateTelegramId(data);
  },
};