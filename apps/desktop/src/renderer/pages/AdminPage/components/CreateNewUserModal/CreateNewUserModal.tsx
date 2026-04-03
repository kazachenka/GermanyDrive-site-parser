import { useState } from "react";
import AppModal from "../../../../shared/ui/AppModal/AppModal";
import { useUser } from "../../../../features/user/model/user.context";
import { AppInput } from "../../../../shared/ui/AppInput/AppInput.tsx";
import { AppButton } from "../../../../shared/ui/AppButton/AppButton.tsx";
import styles from "./CreateNewUserModal.module.css";
import { useError } from "../../../../features/error/error.context.tsx";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function validateEmail(email: string): string | null {
  if (!email) return "Email обязателен";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Некорректный email";

  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Пароль обязателен";
  if (password.length < 6)
    return "Пароль должен быть минимум 6 символов";

  return null;
}

export function CreateNewUserModal({ isOpen, onClose }: Props) {
  const { createUser } = useUser();
  const { showError } = useError();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telegramId, setTelegramId] = useState("");

  const handleCreate = async () => {
    try {
      const emailError = validateEmail(email);
      const passwordError = validatePassword(password);

      if (emailError) {
        showError(emailError);

        return;
      }

      if (passwordError) {
        showError(passwordError);

        return;
      }

      if (!telegramId) {
        showError('Телеграм id обязательный');
      }

      await createUser({ email, password, telegramId: Number(telegramId) });

      setEmail("");
      setPassword("");
      setTelegramId("");
      onClose();
    } catch (error) {

    }
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose}>
      <form className={styles.content} onSubmit={handleCreate}>
        <h3 className={styles.title}>Создать пользователя</h3>

        <div className={styles.fields}>
          <AppInput
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AppInput
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <AppInput
            type="number"
            placeholder="Телеграм id"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <AppButton type="submit">
            Создать
          </AppButton>
        </div>
      </form>
    </AppModal>
  );
}