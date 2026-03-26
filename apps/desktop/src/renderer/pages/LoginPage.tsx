// apps/desktop/src/renderer/pages/LoginPage.tsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { clearAuthError } from "../features/auth/authSlice"
import { loginThunk } from "../features/auth/authThunks"

export function LoginPage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { isLoading, error } = useAppSelector((state) => state.auth)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        dispatch(clearAuthError())

        const resultAction = await dispatch(loginThunk({ email, password }))

        if (loginThunk.fulfilled.match(resultAction)) {
            navigate("/")
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "80px auto", padding: 24 }}>
            <h1>Вход</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={{ marginTop: 12 }}>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div style={{ marginTop: 16 }}>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Входим..." : "Войти"}
                    </button>
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>

            <p style={{ marginTop: 12 }}>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    )
}