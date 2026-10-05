import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import AuthProvider from './modulos/cuenta/AuthProvider.jsx'
import ReservaProvider from './modulos/reserva/ReservaProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ReservaProvider>
          <App />
        </ReservaProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
