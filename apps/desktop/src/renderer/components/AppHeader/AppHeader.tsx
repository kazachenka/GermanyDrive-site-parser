import styles from "./AppHeader.module.css";
import { useAuth } from "../../features/auth/model/auth.context.tsx";
import {NavLink, useNavigate} from "react-router-dom";
import {useSiteParser} from "../../features/parser/model/parser.context.tsx";

export function AppHeader() {
  const { isAdmin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { reset } = useSiteParser();

  const handleLogout = async () => {
    try {

      await logout();

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <NavLink
          to="/parser"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
          onClick={reset}
        >
          Парсинг
        </NavLink>

        <NavLink
          to="/custom-product"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
          onClick={reset}
        >
          Кастомный
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            Админ панель
          </NavLink>
        )}
      </nav>

      <div className={styles.logout} onClick={handleLogout}>
        Выйти
      </div>
    </header>
  );
}