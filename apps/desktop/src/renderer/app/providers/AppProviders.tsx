import type { PropsWithChildren } from "react";
import { AuthProvider } from "../../features/auth/model/auth.context.tsx";

export function AppProviders({ children }: PropsWithChildren) {
    return <AuthProvider>{children}</AuthProvider>;
}