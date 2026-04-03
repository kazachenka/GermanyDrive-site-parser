import styles from "./UsersTable.module.css";

type User = {
  id: number;
  email: string;
};

type Props = {
  users: User[];
  onEditEmail: (user: User) => void;
  onEditPassword: (user: User) => void;
};

export function UsersTable({
                             users,
                             onEditEmail,
                             onEditPassword,
                           }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.table}>
        <div className={styles.header}>
          <span>Email</span>
          <span>Действия</span>
        </div>

        {users.map((user) => (
          <div key={user.id} className={styles.row}>
            <span className={styles.email}>{user.email}</span>

            <div className={styles.actions}>
              <button
                className={styles.iconBtn}
                onClick={() => onEditEmail(user)}
              >
                ✏️
              </button>

              <button
                className={styles.iconBtn}
                onClick={() => onEditPassword(user)}
              >
                🔑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}