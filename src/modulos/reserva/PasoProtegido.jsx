import { useEffect } from 'react'
import { Navigate } from 'react-router'
import useReserva from './useReserva.js'
import { correo, nombreCompleto, telefono } from '../../compartido/formularios/validaciones.js'
import { rutaPaso } from './pasos.js'

// Primer paso al que le falta información, o null si todo lo previo está completo.
function pasoIncompleto(borrador, paso) {
  if (paso > 2 && (!borrador.fecha || !borrador.hora)) return 2
  if (paso > 3 && !borrador.ambienteId) return 3
  const { datos } = borrador
  if (paso > 4 && (nombreCompleto(datos.nombre) || telefono(datos.telefono) || correo(datos.correo))) return 4
  return null
}

// Impide saltar pasos escribiendo la URL y arranca el temporizador al entrar al flujo.
export default function PasoProtegido({ paso, children }) {
  const { borrador, iniciar } = useReserva()

  useEffect(() => {
    iniciar()
  }, [iniciar])

  const faltante = pasoIncompleto(borrador, paso)
  if (faltante) return <Navigate to={rutaPaso(faltante)} replace />
  return children
}
