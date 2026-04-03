import {getUsers, patchUserEmail, patchUserPassword} from "./user.requests.ts";
import {UserDto, UserPatchPassword} from "@site-parser/shared";

export const userApi = {
  async getAllUsers(): Promise<UserDto[]> {
    return await getUsers();
  },
  async patchEmail(data: UserDto): Promise<void> {
    return await patchUserEmail(data);
  },

  async patchPassword(data: UserPatchPassword): Promise<void> {
    return await patchUserPassword(data);
  }
};