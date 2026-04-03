import { useEffect, useState } from "react";
import { UserDto } from "@site-parser/shared";
import AppModal from "../../../../shared/ui/AppModal/AppModal";
import { AppInput } from "../../../../shared/ui/AppInput/AppInput.tsx";
import { AppButton } from "../../../../shared/ui/AppButton/AppButton.tsx";
import { useUser } from "../../../../features/user/model/user.context.tsx";
import styles from "./EditTelegramIdModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: UserDto | null;
};

export function EditTelegramIdModal({ isOpen, onClose, selectedUser }: Props) {
  const { updateTelegramId } = useUser();
  const [telegramId, setTelegramId] = useState("");

  useEffect(() => {
    setTelegramId(String(selectedUser?.telegramId) ?? "");
  }, [selectedUser]);

  const handleSave = async () => {
    try {
      if (!selectedUser) return;

      if (!telegramId) return;
      await updateTelegramId({
        id: selectedUser.id,
        telegramId: Number(telegramId),
      });

      onClose();
    } catch (error) {
      console.error(error);
    }

  };

  return (
    <AppModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <h3 className={styles.title}>Изменить Telegram ID</h3>

        <AppInput
          placeholder="Telegram ID"
          value={telegramId}
          onChange={(e) => setTelegramId(e.target.value)}
        />

        <div className={styles.actions}>
          <AppButton onClick={handleSave}>Сохранить</AppButton>
        </div>
      </div>
    </AppModal>
  );
}