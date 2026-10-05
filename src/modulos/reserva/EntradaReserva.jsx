import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router'
import useReserva from './useReserva.js'
import useTiempoRestante from './useTiempoRestante.js'

// Punto de entrada "/reservar": si quedó un borrador vencido de una visita anterior, se descarta
// para empezar limpio, y se redirige al primer paso conservando ?ambiente=.
export default function EntradaReserva() {
  const { expiraEn, reiniciar } = useReserva()
  const { search } = useLocation()
  const vencido = useTiempoRestante(expiraEn) === 0

  useEffect(() => {
    if (vencido) reiniciar()
  }, [vencido, reiniciar])

  if (vencido) return null
  return <Navigate to={`/reservar/personas${search}`} replace />
}
