import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { logoutThunk } from "../features/auth/authThunks"
import {AppButton} from "../shared/ui/AppButton/AppButton.tsx";

export function HomePage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)

    const handleLogout = async () => {
        await dispatch(logoutThunk())
        navigate("/login")
    }

    return (
        <div style={{ padding: 24 }}>
            <h1>Главная</h1>
            <p>Вы вошли как: {user?.email}</p>
            <AppButton onClick={handleLogout}>Выйти</AppButton>
        </div>
    )
}