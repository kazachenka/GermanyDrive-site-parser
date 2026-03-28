import type { PropsWithChildren } from "react";
import { AuthProvider } from "../../features/auth/model/auth.context.tsx";
import { SiteParserProvider } from "../../features/parser/model/parser.context.tsx";

export function AppProviders({ children }: PropsWithChildren) {
    return <AuthProvider>
                <SiteParserProvider>
                    {children}
                </SiteParserProvider>
            </AuthProvider>;
}