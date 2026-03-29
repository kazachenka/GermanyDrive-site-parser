import styles from "./AppLoader.module.css"

export function AppLoader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.spinner}/>
        <p className={styles.text}>Загрузка приложения...</p>
      </div>
    </div>
  )
}