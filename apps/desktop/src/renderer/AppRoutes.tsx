import { Navigate, Route, Routes } from "react-router-dom"
import { GuestRoute } from "./shared/router/GuestRoute"
import { ProtectedRoute } from "./shared/router/ProtectedRoute"
import { LoginPage } from "./pages/LoginPage/LoginPage.tsx"
import { RegisterPage } from "./pages/RegisterPage/RegisterPage.tsx"
import { HomePage } from "./pages/HomePage"

export function AppRoutes() {
    return (
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
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}