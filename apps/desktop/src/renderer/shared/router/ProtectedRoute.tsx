import { type ReactElement } from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { AppLoader } from "../ui/AppLoader/AppLoader"

type ProtectedRouteProps = {
    children: ReactElement
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, initialized } = useAppSelector((state) => state.auth)

    if (!initialized) {
        return <AppLoader />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}