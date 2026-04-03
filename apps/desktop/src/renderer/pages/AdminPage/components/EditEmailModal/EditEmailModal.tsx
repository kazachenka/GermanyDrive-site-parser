import { useState } from "react";
import AppModal from "../../../../shared/ui/AppModal/AppModal.tsx";
import {AppInput} from "../../../../shared/ui/AppInput/AppInput.tsx";
import {AppButton} from "../../../../shared/ui/AppButton/AppButton.tsx";
import {UserDto} from "@site-parser/shared";
import {useUser} from "../../../../features/user/model/user.context.tsx";
import {useError} from "../../../../features/error/error.context.tsx";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: UserDto | null;
};

export function EditEmailModal({
                                 isOpen,
                                 onClose,
                                 selectedUser,
                               }: Props) {
  const [email, setEmail] = useState(selectedUser?.email ?? '');
  const { updateEmail, isLoading } = useUser();
  const { showError} = useError();

  const handleSave = async () => {
    if (selectedUser) {
      if (!email.includes("@")) return;

      try {
        await updateEmail({
          id: selectedUser?.id,
          email,
        });

        onClose();
      } catch (err) {
        console.error(err);

        showError('Не удалось обновить почту');
      }
    }
  }

  return (
    <AppModal isOpen={isOpen} onClose={onClose}>
      <h3>Изменить email</h3>

      <AppInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Введите email"
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