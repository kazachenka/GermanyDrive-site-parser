import type { ReactNode } from "react"
import styles from "./AppCard.module.css"

type CardProps = {
    children: ReactNode
    className?: string
}

export function AppCard({ children, className }: CardProps) {
    return (
        <div className={`${styles.card} ${className || ""}`}>
            {children}
        </div>
    )
}