import styles from "./UsersTable.module.css";
import { UserDto } from '@site-parser/shared';


type Props = {
  users: UserDto[];
  onEditEmail: (user: UserDto) => void;
  onEditPassword: (user: UserDto) => void;
  onEditTelegramId: (user: UserDto) => void;
  onDelete: (user: UserDto) => void;
};

export function UsersTable({
                             users,
                             onEditEmail,
                             onEditPassword,
                             onEditTelegramId,
                             onDelete
                           }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.table}>
        <div className={styles.header}>
          <span className={styles.email}>Email</span>
          <span className={styles.telegramId}>Telegram ID</span>
          <span className={styles.actionsLabel}>Действия</span>
        </div>

        {users.map((user) => (
          <div key={user.id} className={styles.row}>
            <span className={styles.email}>{user.email}</span>
            <span className={styles.telegramId}>
              {user.telegramId || "—"}
            </span>

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
              <button
                className={styles.iconBtn}
                onClick={() => onEditTelegramId(user)}
                title="Изменить telegramId"
              >
                Telegram
              </button>
              <button
                className={styles.iconBtn}
                onClick={() => onDelete(user)}
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}