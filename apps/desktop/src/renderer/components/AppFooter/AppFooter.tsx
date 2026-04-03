import { AppVersion } from "../../shared/ui/AppVersion/AppVersion.tsx";
import styles from "./AppFooter.module.css";

export function AppFooter() {
  return (
    <footer className={styles.footer}>
      <AppVersion />
    </footer>
  )
}