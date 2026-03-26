import type { ReactNode } from "react"
import styles from "./AuthLayout.module.css"

type Props = {
    title: string
    subtitle?: string
    children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: Props) {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{title}</h1>
                    {subtitle && (
                        <p className={styles.subtitle}>{subtitle}</p>
                    )}
                </div>

                {children}
            </div>
        </div>
    )
}