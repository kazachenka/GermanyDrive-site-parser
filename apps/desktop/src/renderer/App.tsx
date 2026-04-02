import { HashRouter } from "react-router-dom"
import {AppRoutes} from "./app/routes/AppRoutes.tsx"
import {AppProviders} from "./app/providers/AppProviders.tsx";
import {AppVersion} from "./shared/ui/AppVersion/AppVersion.tsx";

export default function App() {
  return (
    <>
      <AppProviders>
        <HashRouter>
          <AppRoutes/>
        </HashRouter>
      </AppProviders>

      <AppVersion />
    </>
  )
}