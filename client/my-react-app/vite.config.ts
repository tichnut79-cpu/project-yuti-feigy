import {defineConfig} from 'vite'
import react, {reactCompilerPreset} from '@vitejs/plugin-react'
import babel from '@rollup/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true // פותח את הדפדפן ברגע שהשרת רץ
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})