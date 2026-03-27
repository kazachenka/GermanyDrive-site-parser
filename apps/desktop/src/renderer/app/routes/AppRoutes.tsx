import { Navigate, Route, Routes } from "react-router-dom"
import { GuestRoute } from "../../shared/router/GuestRoute.tsx"
import { ProtectedRoute } from "../../shared/router/ProtectedRoute.tsx"
import { LoginPage } from "../../pages/LoginPage/LoginPage.tsx"
import { RegisterPage } from "../../pages/RegisterPage/RegisterPage.tsx"
import { HomePage } from "../../pages/HomePage/HomePage.tsx"

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