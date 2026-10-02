import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import ReservaProvider from './context/ReservaProvider.jsx'

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
