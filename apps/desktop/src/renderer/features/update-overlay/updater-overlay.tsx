import React from "react"

type Props = {
  open: boolean
  title?: string
  percent?: number
  bytesPerSecond?: number
}

function formatSpeed(bytesPerSecond?: number) {
  if (!bytesPerSecond || bytesPerSecond <= 0) return "0 KB/s"

  const kb = bytesPerSecond / 1024
  const mb = kb / 1024

  if (mb >= 1) {
    return `${mb.toFixed(2)} MB/s`
  }

  return `${kb.toFixed(0)} KB/s`
}

export const UpdaterOverlay: React.FC<Props> = ({
                                                  open,
                                                  title = "Скачивание обновления...",
                                                  percent = 0,
                                                  bytesPerSecond = 0
                                                }) => {
  if (!open) return null

  const safePercent = Math.max(0, Math.min(100, percent))

  return (
    <div style={styles.backdrop}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.spinner} />
          <h2 style={styles.title}>{title}</h2>
        </div>

        <div style={styles.progressWrapper}>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressBar,
                width: `${safePercent}%`
              }}
            />
          </div>

          <div style={styles.metaRow}>
            <span>{safePercent.toFixed(0)}%</span>
            <span>{formatSpeed(bytesPerSecond)}</span>
          </div>
        </div>

        <p style={styles.description}>
          Не закрывайте приложение. Обновление загружается.
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999999,
    pointerEvents: "all"
  },
  card: {
    width: 420,
    maxWidth: "90%",
    padding: "24px 24px 20px",
    borderRadius: 16,
    background: "#1e1e1e",
    color: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    textAlign: "left"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18
  },
  spinner: {
    width: 18,
    height: 18,
    border: "3px solid rgba(255,255,255,0.2)",
    borderTop: "3px solid #4f8cff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 600
  },
  progressWrapper: {
    marginBottom: 16
  },
  progressTrack: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    background: "#3a3a3a"
  },
  progressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #4f8cff, #7aa7ff)",
    borderRadius: 999,
    transition: "width 0.2s ease"
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
    fontSize: 13,
    opacity: 0.85
  },
  description: {
    margin: 0,
    fontSize: 13,
    opacity: 0.8
  }
}