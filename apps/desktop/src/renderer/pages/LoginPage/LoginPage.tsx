import {useState, type FormEvent} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../features/auth/model/auth.context";
import {AuthLayout} from "../../layouts/AuthLayout/AuthLayout";
import {AppButton} from "../../shared/ui/AppButton/AppButton";
import {AppCard} from "../../shared/ui/AppCard/AppCard";
import {AppInput} from "../../shared/ui/AppInput/AppInput";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const navigate = useNavigate();
  const {login, isLoadingAuth, error, clearAuthError} = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    clearAuthError();

    try {
      await login({email, password});
      navigate("/");
    } catch {
    }
  };

  return (
    <AuthLayout
      title="С возвращением"
      subtitle="Войдите в аккаунт, чтобы продолжить работу с приложением."
    >
      <AppCard>
        <div className={styles.header}>
          <h2 className={styles.cardTitle}>Вход</h2>
          <p className={styles.cardSubtitle}>
            Используйте email и пароль для входа
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <AppInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AppInput
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className={styles.error}>{error}</p>}

          <AppButton fullWidth type="submit" loading={isLoadingAuth}>
            {isLoadingAuth ? "Входим..." : "Войти"}
          </AppButton>
        </form>

        <div className={styles.footer}>
          <span className={styles.footerText}>Нет аккаунта?</span>
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </div>
      </AppCard>
    </AuthLayout>
  );
}