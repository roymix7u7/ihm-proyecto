import useReserva from '../useReserva.js'
import useTiempoRestante from '../useTiempoRestante.js'

function formatear(ms) {
  const segundos = Math.ceil(ms / 1000)
  return `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`
}

// Cuenta regresiva de los 10 minutos que se guarda la selección.
// En los últimos 2 minutos cambia a rojo y avisa a lectores de pantalla.
export default function Temporizador({ compacto = false, className = '' }) {
  const { expiraEn } = useReserva()
  const restante = useTiempoRestante(expiraEn)
  if (restante === null) return null

  const minutos = Math.ceil(restante / 60000)
  const urgente = restante <= 120_000
  const anuncio = urgente && restante > 0 ? `Quedan ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'} para completar tu reserva.` : ''

  if (compacto) {
    return (
      <p className={`flex items-center gap-2 text-sm text-carbon ${className}`}>
        Tiempo restante
        <span
          role="timer"
          className={`rounded-full px-3 py-0.5 font-serif text-xl text-crema ${urgente ? 'bg-error' : 'bg-oro'}`}
        >
          {formatear(restante)}
        </span>
        <span className="sr-only" aria-live="polite">
          {anuncio}
        </span>
      </p>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <p className="font-serif text-[28px] text-carbon">Tiempo restante</p>
      <span
        role="timer"
        aria-label={`Tiempo restante ${formatear(restante)}`}
        className={`flex h-[38px] w-[123px] items-center justify-center rounded-[30px] font-serif text-[28px] text-crema transition-colors ${
          urgente ? 'bg-error' : 'bg-oro'
        }`}
      >
        {formatear(restante)}
      </span>
      <span className="sr-only" aria-live="polite">
        {anuncio}
      </span>
    </div>
  )
}
