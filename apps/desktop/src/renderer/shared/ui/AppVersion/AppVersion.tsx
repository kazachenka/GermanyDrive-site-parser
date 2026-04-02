import { useEffect, useState } from "react"
import styles from "./AppVersion.module.css"

export function AppVersion() {
  const [version, setVersion] = useState<string>("")

  useEffect(() => {
    window.appInfo.getVersion().then(setVersion)
  }, [])

  return <div className={styles.container}>v{version}</div>
}