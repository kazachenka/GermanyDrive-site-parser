import type {PropsWithChildren} from "react";
import {AuthProvider} from "../../features/auth/model/auth.context.tsx";
import {SiteParserProvider} from "../../features/parser/model/parser.context.tsx";
import {ErrorProvider} from "../../features/error/error.context.tsx";
import {UpdaterProvider} from "../../features/update-overlay/updater-provider.tsx";

export function AppProviders({children}: PropsWithChildren) {
  return <UpdaterProvider>
          <ErrorProvider>
            <AuthProvider>
              <SiteParserProvider>
                {children}
              </SiteParserProvider>
            </AuthProvider>
          </ErrorProvider>
        </UpdaterProvider>


}