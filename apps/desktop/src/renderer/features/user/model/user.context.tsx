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
import { UserDto, UserPatchPassword } from '@site-parser/shared'
import {useError} from "../../error/error.context.tsx";
import {useAuth} from "../../auth/model/auth.context.tsx";

interface UserContextValue {
  users: UserDto[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  updateEmail: (data: UserDto) => Promise<void>;
  updatePassword: (data: UserPatchPassword) => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {showError} = useError();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Не удалось загрузить пользователей");
    } finally {
      setIsLoading(false);
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
    }),
    [users, isLoading, error, fetchUsers, updateEmail, updatePassword]
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