import { useEffect, useState } from 'react'

// Milisegundos que faltan hasta `expiraEn`, actualizado cada segundo.
export default function useTiempoRestante(expiraEn) {
  const [ahora, setAhora] = useState(() => Date.now())

  useEffect(() => {
    if (!expiraEn) return
    const intervalo = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(intervalo)
  }, [expiraEn])

  return expiraEn ? Math.max(0, expiraEn - ahora) : null
}
