import { type ReactElement } from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { AppLoader } from "../ui/AppLoader/AppLoader"

type GuestRouteProps = {
    children: ReactElement
}

export function GuestRoute({ children }: GuestRouteProps) {
    const { user, initialized } = useAppSelector((state) => state.auth)

    if (!initialized) {
        return <AppLoader />
    }

    if (user) {
        return <Navigate to="/" replace />
    }

    return children
}