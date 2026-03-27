import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./app/routes/AppRoutes.tsx"
import { AppProviders } from "./app/providers/AppProviders.tsx";

export default function App() {
    return (
        <AppProviders>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AppProviders>
    )
}