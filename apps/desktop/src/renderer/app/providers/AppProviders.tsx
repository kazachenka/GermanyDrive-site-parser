import type {PropsWithChildren} from "react";
import {AuthProvider} from "../../features/auth/model/auth.context.tsx";
import {SiteParserProvider} from "../../features/parser/model/parser.context.tsx";
import {ErrorProvider} from "../../features/error/error.context.tsx";

export function AppProviders({children}: PropsWithChildren) {
  return <ErrorProvider>
          <AuthProvider>
            <SiteParserProvider>
              {children}
            </SiteParserProvider>
          </AuthProvider>
        </ErrorProvider>;
}