import { Buffer } from 'buffer';

// Polyfill para o StompJS funcionar no navegador
if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = Buffer;
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx' // Importando com letra minúscula conforme seu arquivo
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)