import styles from "./AppHeader.module.css";
import { useAuth } from "../../features/auth/model/auth.context.tsx";
import { NavLink } from "react-router-dom";

export function AppHeader() {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (<></>);
  }

  return (
    <header className={styles.header}>
      {isAdmin && (
        <nav className={styles.navigation}>
          <NavLink
            to="/parser"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Парсинг
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Админ панель
          </NavLink>
        </nav>
      )}
    </header>
  );
}