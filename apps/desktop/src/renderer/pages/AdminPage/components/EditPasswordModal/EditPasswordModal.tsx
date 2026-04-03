import { useState } from "react";
import AppModal from "../../../../shared/ui/AppModal/AppModal.tsx";
import {AppInput} from "../../../../shared/ui/AppInput/AppInput.tsx";
import {AppButton} from "../../../../shared/ui/AppButton/AppButton.tsx";
import {UserDto} from '@site-parser/shared'
import {useUser} from "../../../../features/user/model/user.context.tsx";
import {useError} from "../../../../features/error/error.context.tsx";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: UserDto | null;
};

export function EditPasswordModal({
                                    isOpen,
                                    onClose,
                                    selectedUser,
                                  }: Props) {
  const [password, setPassword] = useState("");
  const { updatePassword, isLoading } = useUser();
  const { showError } = useError();

  const handleSave = async () => {
      if (selectedUser) {
        if (password.length < 6) return;

        try {
          await updatePassword({
            id: selectedUser.id,
            password,
          })

          onClose();
        }
        catch (err) {
          console.error("Failed to update password", err);
          showError('Не удалось обновить пароль')
        }
      }
  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose}>
      <h3>Сменить пароль</h3>

      <AppInput
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Новый пароль"
      />

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <AppButton onClick={handleSave} disabled={isLoading}>
          Сохранить
        </AppButton>

        <AppButton onClick={onClose}>Отмена</AppButton>
      </div>
    </AppModal>
  );
}