import { Navigate, useLocation } from 'react-router'
import useAuth from './useAuth.js'

// Envía al login a quien no inició sesión y luego lo regresa a donde quería ir.
export default function RequiereSesion({ children }) {
  const { usuario } = useAuth()
  const { pathname, search } = useLocation()
  if (!usuario) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(pathname + search)}`} replace />
  }
  return children
}
