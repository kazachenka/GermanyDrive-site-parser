import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { fetchMeThunk } from "./features/auth/authThunks"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { HomePage } from "./pages/HomePage"

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { user, initialized } = useAppSelector((state) => state.auth)

    if (!initialized) return <div>Загрузка...</div>
    return user ? children : <Navigate to="/login" replace />
}

function GuestRoute({ children }: { children: JSX.Element }) {
    const { user, initialized } = useAppSelector((state) => state.auth)

    if (!initialized) return <div>Загрузка...</div>
    return user ? <Navigate to="/" replace /> : children
}

export default function App() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        void dispatch(fetchMeThunk())
    }, [dispatch])

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <LoginPage />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <RegisterPage />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}