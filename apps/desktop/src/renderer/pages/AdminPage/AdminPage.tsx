import {UsersTable} from "./components/UsersTable/UsersTable.tsx";
import { useState } from "react";
import { EditEmailModal} from "./components/EditEmailModal/EditEmailModal.tsx";
import {EditPasswordModal} from "./components/EditPasswordModal/EditPasswordModal.tsx";
import {UserDto} from "@site-parser/shared"
import {useUser} from "../../features/user/model/user.context.tsx";
import {AppLoader} from "../../shared/ui/AppLoader/AppLoader.tsx";
import {AppButton} from "../../shared/ui/AppButton/AppButton.tsx";
import {CreateNewUserModal} from "./components/CreateNewUserModal/CreateNewUserModal.tsx";
import AppModal from "../../shared/ui/AppModal/AppModal.tsx";
import styles from "../ProductPage/ProductPage.module.css";
import {EditTelegramIdModal} from "./components/EditTelegramIdModal/EditTelegramIdModal.tsx";

export function AdminPage() {
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [telegramIdOpen, setTelegramIdOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const {
    users,
    isLoading,
    deleteUser
  } = useUser();

  const removeUser = async (selectedUser: UserDto | null) => {
    try {
      if (selectedUser) {
        console.log(selectedUser);
        await deleteUser(selectedUser.id);
        setRemoveOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (isLoading) {
    return <AppLoader />
  }

  return (
    <>
      <AppButton onClick={() => setCreateOpen(true)}>
        + Добавить пользователя
      </AppButton>

      <UsersTable
        users={users}
        onEditEmail={(user) => {
          setSelectedUser(user);
          setEmailOpen(true);
        }}
        onEditPassword={(user) => {
          setSelectedUser(user);
          setPasswordOpen(true);
        }}
        onDelete={(user) => {
          setSelectedUser(user);
          setRemoveOpen(true);
        }}
        onEditTelegramId={(user) => {
          setSelectedUser(user);
          setTelegramIdOpen(true);
        }}
      />

      <CreateNewUserModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <EditEmailModal
        isOpen={emailOpen}
        onClose={() => setEmailOpen(false)}
        selectedUser={selectedUser}
      />

      <EditPasswordModal
        isOpen={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        selectedUser={selectedUser}
      />

      <EditTelegramIdModal
        isOpen={telegramIdOpen}
        onClose={() => setTelegramIdOpen(false)}
        selectedUser={selectedUser}
      />

      <AppModal isOpen={removeOpen} onClose={() => setRemoveOpen(false)}>
        <p className={styles.modalText}>Вы действительно желаете удалить этого юзера?</p>
        <div className={styles.buttonWrapper}>
          <AppButton onClick={() => setRemoveOpen(false)}>Отмена</AppButton>
          <AppButton onClick={() => removeUser(selectedUser)}>Да</AppButton>
        </div>

      </AppModal>
    </>
  )
}