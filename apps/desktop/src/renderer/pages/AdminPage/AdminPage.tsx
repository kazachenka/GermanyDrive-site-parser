import {UsersTable} from "./components/UsersTable/UsersTable.tsx";
import {useEffect, useState} from "react";
import {EditEmailModal} from "./components/EditEmailModal/EditEmailModal.tsx";
import {EditPasswordModal} from "./components/EditPasswordModal/EditPasswordModal.tsx";
import {UserDto} from "@site-parser/shared"
import {useUser} from "../../features/user/model/user.context.tsx";
import {AppLoader} from "../../shared/ui/AppLoader/AppLoader.tsx";

export function AdminPage() {
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const {
    users,
    isLoading
  } = useUser();

  if (isLoading) {
    return <AppLoader />
  }

  return (
    <>
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
    </>
  )
}