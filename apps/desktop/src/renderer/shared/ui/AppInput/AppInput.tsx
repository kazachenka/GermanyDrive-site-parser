import type {InputHTMLAttributes} from "react"
import styles from "./AppInput.module.css"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function AppInput({label, error, ...props}: InputProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <input
        className={`${styles.input} ${error ? styles.error : ""}`}
        {...props}
      />

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}