import { ipcMain } from "electron";
import {
  createNewUser,
  getUsers,
  patchEmail,
  patchPassword,
  patchUserTelegramId,
  removeUser
} from "../services/user-api.service";
import {RegisterRequestDto, UserDto, UserPatchPassword, UserPatchTelegramId} from '@site-parser/shared';

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
  ipcMain.handle("user:add-user", async (_, data: RegisterRequestDto): Promise<void> => {
    return createNewUser(data);
  });
  ipcMain.handle("user:remove-user", async (_, id: number): Promise<void> => {
    return removeUser(id);
  });
  ipcMain.handle("user:update-telegram-id", async (_, data: UserPatchTelegramId): Promise<void> => {
    return patchUserTelegramId(data);
  });
}