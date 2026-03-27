import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/model/auth.context";
import { AuthLayout } from "../../layouts/AuthLayout/AuthLayout";
import { AppButton } from "../../shared/ui/AppButton/AppButton";
import { AppCard } from "../../shared/ui/AppCard/AppCard";
import { AppInput } from "../../shared/ui/AppInput/AppInput";
import styles from "./RegisterPage.module.css";

export function RegisterPage() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearAuthError } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        clearAuthError();

        try {
            await register({ email, password });
            navigate("/");
        } catch {
            // ошибка уже в context.error
        }
    };

    return (
        <AuthLayout
            title="Создание аккаунта"
            subtitle="Зарегистрируйтесь, чтобы начать работу с приложением."
        >
            <AppCard>
                <div className={styles.header}>
                    <h2 className={styles.cardTitle}>Регистрация</h2>
                    <p className={styles.cardSubtitle}>
                        Заполните форму для создания аккаунта
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

                    <AppButton fullWidth type="submit" loading={isLoading}>
                        {isLoading ? "Создаем..." : "Зарегистрироваться"}
                    </AppButton>
                </form>

                <div className={styles.footer}>
          <span className={styles.footerText}>
            Уже есть аккаунт?
          </span>
                    <Link to="/login" className={styles.link}>
                        Войти
                    </Link>
                </div>
            </AppCard>
        </AuthLayout>
    );
}