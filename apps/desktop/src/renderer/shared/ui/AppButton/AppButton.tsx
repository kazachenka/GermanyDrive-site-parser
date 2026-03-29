import type {ButtonHTMLAttributes, ReactNode} from "react"
import styles from "./AppButton.module.css"

type Variant = "primary" | "secondary" | "ghost"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: Variant
  fullWidth?: boolean
  loading?: boolean
}

export function AppButton({
                            children,
                            variant = "primary",
                            fullWidth,
                            loading,
                            disabled,
                            ...props
                          }: ButtonProps) {
  return (
    <button
      className={[
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
      ].join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className={styles.loader}/> : children}
    </button>
  )
}