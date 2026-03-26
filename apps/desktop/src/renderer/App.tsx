import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { useAppDispatch } from "./app/hooks"
import { fetchMeThunk } from "./features/auth/authThunks"
import { AppRoutes } from "./AppRoutes"

export default function App() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        void dispatch(fetchMeThunk())
    }, [dispatch])

    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    )
}