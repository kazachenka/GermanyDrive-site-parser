import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/model/auth.context";
import { AppButton } from "../../shared/ui/AppButton/AppButton";

export function HomePage() {
    const navigate = useNavigate();
    const { user, logout, isLoading } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div style={{ padding: 24 }}>
            <h1>Главная</h1>
            <p>Вы вошли как: {user?.email}</p>
            <AppButton onClick={handleLogout} loading={isLoading}>
                Выйти
            </AppButton>
        </div>
    );
}