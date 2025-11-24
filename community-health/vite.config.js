// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // 🛠️ Correção para 'Uncaught ReferenceError: global is not defined'
  define: {
    // Mapeia referências a 'global' para 'window', o objeto global do navegador.
    global: 'window', 
  },
})