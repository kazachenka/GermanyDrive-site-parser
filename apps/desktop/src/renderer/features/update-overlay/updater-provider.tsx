import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import {UpdaterOverlay} from "./updater-overlay.tsx";

type BlockUiState = {
  blocked: boolean
  title: string
}

type ProgressState = {
  percent: number
  bytesPerSecond: number
  transferred: number
  total: number
}

type UpdaterContextValue = {
  blocked: boolean
  title: string
  progress: ProgressState
}

const UpdaterContext = createContext<UpdaterContextValue | null>(null)

export function UpdaterProvider({ children }: { children: React.ReactNode }) {
  const [blockUi, setBlockUi] = useState<BlockUiState>({
    blocked: false,
    title: ""
  })

  const [progress, setProgress] = useState<ProgressState>({
    percent: 0,
    bytesPerSecond: 0,
    transferred: 0,
    total: 0
  })

  useEffect(() => {
    if (!window.updater) return

    const unsubscribeBlock = window.updater.onBlockUi((payload) => {
      setBlockUi(payload)

      if (!payload.blocked) {
        setProgress({
          percent: 0,
          bytesPerSecond: 0,
          transferred: 0,
          total: 0
        })
      }
    })

    const unsubscribeProgress = window.updater.onProgress((payload) => {
      setProgress(payload)
    })

    return () => {
      unsubscribeBlock?.()
      unsubscribeProgress?.()
    }
  }, [])

  const value = useMemo<UpdaterContextValue>(
    () => ({
      blocked: blockUi.blocked,
      title: blockUi.title,
      progress
    }),
    [blockUi, progress]
  )

  return (
    <UpdaterContext.Provider value={value}>
      {children}

      <UpdaterOverlay
        open={blockUi.blocked}
        title={blockUi.title}
        percent={progress.percent}
        bytesPerSecond={progress.bytesPerSecond}
      />
    </UpdaterContext.Provider>
  )
}

export function useUpdater() {
  const context = useContext(UpdaterContext)

  if (!context) {
    throw new Error("useUpdater must be used inside UpdaterProvider")
  }

  return context
}