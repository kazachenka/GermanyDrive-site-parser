import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { userApi } from "../api/user.api.ts";
import {RegisterRequestDto, UserDto, UserPatchPassword, UserPatchTelegramId} from '@site-parser/shared'
import {useError} from "../../error/error.context.tsx";
import {useAuth} from "../../auth/model/auth.context.tsx";

interface UserContextValue {
  users: UserDto[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  updateEmail: (data: UserDto) => Promise<void>;
  updatePassword: (data: UserPatchPassword) => Promise<void>;
  createUser: (data: RegisterRequestDto) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  updateTelegramId: (data: UserPatchTelegramId) => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useError();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log("FETCH USERS START");

    try {
      const data = await userApi.getAllUsers();
      console.log("FETCH USERS RESULT:", data);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Не удалось загрузить пользователей");
    } finally {
      setIsLoading(false);
      console.log("FETCH USERS EnDEd");
    }
  }, []);

  const updateEmail = useCallback(
    async (data: UserDto) => {
      setError(null);

      try {
        await userApi.patchEmail(data);
        await fetchUsers();
      } catch (err) {
        console.error("Failed to update email", err);
        setError("Не удалось обновить email");
        throw err;
      }
    },
    [fetchUsers]
  );

  const updatePassword = useCallback(async (data: UserPatchPassword) => {
    setError(null);

    try {
      await userApi.patchPassword(data);
    } catch (err) {
      console.error("Failed to update password", err);
      setError("Не удалось обновить пароль");
      throw err;
    }
  }, []);

  const createUser = useCallback(
    async (data: RegisterRequestDto) => {
      try {
        await userApi.createUser(data);
        await fetchUsers();
      } catch (err) {
        setError("Не удалось создать пользователя");
        throw err;
      }
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(
    async (id: number) => {
      try {
        await userApi.deleteUser(id);
        await fetchUsers();
      } catch (err) {
        setError("Не удалось удалить пользователя");
        throw err;
      }
    },
    [fetchUsers]
  );

  const updateTelegramId = useCallback(
    async (data: UserPatchTelegramId) => {
      setError(null);

      try {
        await userApi.patchTelegramId(data);
        await fetchUsers();
      } catch (err) {
        console.error("Failed to update telegramId", err);
        setError("Не удалось обновить telegramId");
        throw err;
      }
    },
    [fetchUsers]
  );

  useEffect(() => {
    if (isAuthenticated) {
      void fetchUsers();
    } else {
      setUsers([]);
    }
  }, [isAuthenticated, fetchUsers]);
  const value = useMemo<UserContextValue>(
    () => ({
      users,
      isLoading,
      error,
      fetchUsers,
      updateEmail,
      updatePassword,
      createUser,
      deleteUser,
      updateTelegramId
    }),
    [users, isLoading, error, fetchUsers, updateEmail, updatePassword, createUser, deleteUser, updateTelegramId]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}