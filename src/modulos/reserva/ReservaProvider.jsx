import { useCallback, useEffect, useMemo, useState } from 'react'
import { parametros } from '../../datos/catalogos/restaurante.js'
import { ReservaContext } from './useReserva.js'

// Borrador de la reserva mientras se completa el flujo de 7 pasos.
// Se guarda en sessionStorage para que recargar la página no borre lo avanzado.
const CLAVE = 'ceniza-borrador'

const vacio = {
  personas: parametros.personas_minimo,
  fecha: null,
  hora: null,
  ambienteId: null,
  ambientePreferido: null,
  datos: { nombre: '', telefono: '', correo: '', comentarios: '' },
  inicio: null,
}

function cargar() {
  try {
    const guardado = sessionStorage.getItem(CLAVE)
    return guardado ? { ...vacio, ...JSON.parse(guardado) } : vacio
  } catch {
    return vacio
  }
}

export default function ReservaProvider({ children }) {
  const [borrador, setBorrador] = useState(cargar)

  useEffect(() => {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(borrador))
    } catch {
      // Sin almacenamiento: el borrador vive solo en memoria.
    }
  }, [borrador])

  const actualizar = useCallback((cambios) => setBorrador((actual) => ({ ...actual, ...cambios })), [])

  // Arranca el temporizador de 10 minutos la primera vez que se entra al flujo.
  const iniciar = useCallback(
    (ambientePreferido) =>
      setBorrador((actual) => ({
        ...actual,
        inicio: actual.inicio ?? Date.now(),
        ambientePreferido: ambientePreferido ?? actual.ambientePreferido,
      })),
    [],
  )

  const reiniciar = useCallback(() => setBorrador(vacio), [])

  const expiraEn = borrador.inicio ? borrador.inicio + parametros.minutos_para_completar * 60_000 : null
  const garantiaTotal = borrador.personas * parametros.garantia_por_persona

  const valor = useMemo(
    () => ({ borrador, actualizar, iniciar, reiniciar, expiraEn, garantiaTotal }),
    [borrador, actualizar, iniciar, reiniciar, expiraEn, garantiaTotal],
  )

  return <ReservaContext.Provider value={valor}>{children}</ReservaContext.Provider>
}
