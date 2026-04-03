import { HashRouter } from "react-router-dom"
import {AppRoutes} from "./app/routes/AppRoutes.tsx"
import {AppProviders} from "./app/providers/AppProviders.tsx";
import MainLayout from "./layouts/MainLayout/MainLayout.tsx";

export default function App() {
  return (
      <AppProviders>
        <HashRouter>
          <MainLayout>
            <AppRoutes/>
          </MainLayout>
        </HashRouter>
      </AppProviders>
  )
}