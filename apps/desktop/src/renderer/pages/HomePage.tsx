// apps/desktop/src/renderer/pages/HomePage.tsx
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { logoutThunk } from "../features/auth/authThunks"

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
            <button onClick={handleLogout}>Выйти</button>
        </div>
    )
}