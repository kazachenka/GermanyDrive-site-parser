import { defineConfig, externalizeDepsPlugin, loadEnv } from "electron-vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      define: {
        "process.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL)
      },
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, "src/main/main.ts")
          }
        }
      }
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      define: {
        "process.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL)
      },
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, "src/main/preload.ts")
          }
        }
      }
    },
    renderer: {
      root: resolve(__dirname, "src/renderer"),
      plugins: [react()],
      define: {
        "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL)
      }
    }
  }
})