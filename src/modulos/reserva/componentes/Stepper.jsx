import { Link } from 'react-router'
import iconoCheck from '../../../assets/icons/check-blanco.svg'
import { pasos } from '../pasos.js'

function Indicador({ estado, numero }) {
  if (estado === 'completado') {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-carbon">
        <img src={iconoCheck} alt="" width="10" height="10" />
      </span>
    )
  }
  return (
    <span
      className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
        estado === 'actual' ? 'bg-oro text-white' : 'border border-grafito text-grafito'
      }`}
    >
      {numero}
    </span>
  )
}

// Barra de progreso del checkout. Los pasos ya completados son enlaces para volver a editarlos.
export default function Stepper({ actual, bloqueado = false }) {
  const pasoActual = pasos[actual - 1]
  return (
    <nav aria-label="Progreso de la reserva" className="border-b border-linea px-5 pt-6 pb-5 md:px-10 lg:px-20 lg:pt-10 lg:pb-6">
      <div className="lg:hidden">
        <p className="text-xs text-grafito">
          Paso {actual} de 7 · <span className="font-semibold text-oro">{pasoActual.label}</span>
        </p>
        <div
          className="mt-3 h-1 w-full rounded-full bg-linea"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={7}
          aria-valuenow={actual}
          aria-label="Avance de la reserva"
        >
          <div className="h-full rounded-full bg-oro transition-all" style={{ width: `${(actual / 7) * 100}%` }} />
        </div>
      </div>

      <ol className="hidden items-center justify-between lg:flex">
        {pasos.map((paso) => {
          const estado = paso.numero < actual ? 'completado' : paso.numero === actual ? 'actual' : 'pendiente'
          const contenido = (
            <>
              <Indicador estado={estado} numero={paso.numero} />
              <span
                className={`text-xs ${
                  estado === 'actual' ? 'font-semibold text-oro' : estado === 'completado' ? 'text-carbon' : 'text-grafito'
                }`}
              >
                {paso.label}
              </span>
            </>
          )
          return (
            <li key={paso.numero}>
              {estado === 'completado' && paso.ruta && !bloqueado ? (
                <Link to={paso.ruta} className="flex items-center gap-2 rounded hover:underline">
                  {contenido}
                  <span className="sr-only">(completado, volver a este paso)</span>
                </Link>
              ) : (
                <span className="flex items-center gap-2" aria-current={estado === 'actual' ? 'step' : undefined}>
                  {contenido}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
