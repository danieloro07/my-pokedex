import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages sirve el sitio en /my-pokedex/, no en la raíz.
  // En desarrollo seguimos usando "/" (http://localhost:5173/).
  base: command === 'build' ? '/my-pokedex/' : '/',
  css: {
    modules: {
      // Clases legibles en desarrollo: "Escenario_halo__x1y2"
      localsConvention: 'camelCaseOnly',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
}))
