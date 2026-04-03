import { ipcMain } from "electron";
import { getUsers, patchEmail, patchPassword } from "../services/user-api.service";
import { UserDto, UserPatchPassword } from '@site-parser/shared';

export function registerUserIpcHandlers() {
  ipcMain.handle("user:patch-email", async (_, data: UserDto) => {
    return patchEmail(data)
  });
  ipcMain.handle("user:patch-password", async (_, data: UserPatchPassword) => {
    return patchPassword(data);
  });
  ipcMain.handle("user:get-users", async (): Promise<UserDto[]> => {
    return getUsers();
  });
}