import { useState } from 'react'
import { aTexto, deTexto, nombreMes } from '../../utils/fechas.js'

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

// Calendario mensual. `estado(fechaTexto)` indica si cada día se puede elegir.
export default function Calendario({ valor, onCambiar, estado, minima, maxima }) {
  const inicial = valor ? deTexto(valor) : minima
  const [mes, setMes] = useState(new Date(inicial.getFullYear(), inicial.getMonth(), 1))

  const puedeAtras = mes > new Date(minima.getFullYear(), minima.getMonth(), 1)
  const puedeAdelante = mes < new Date(maxima.getFullYear(), maxima.getMonth(), 1)
  const cambiarMes = (delta) => setMes(new Date(mes.getFullYear(), mes.getMonth() + delta, 1))

  const desfase = (mes.getDay() + 6) % 7 // la semana empieza en lunes
  const diasDelMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate()
  const celdas = [
    ...Array.from({ length: desfase }, () => null),
    ...Array.from({ length: diasDelMes }, (_, i) => new Date(mes.getFullYear(), mes.getMonth(), i + 1)),
  ]

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-linea bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[22px] text-carbon" aria-live="polite">
          {nombreMes(mes.getMonth())} {mes.getFullYear()}
        </h3>
        <div className="flex gap-2 text-base font-semibold">
          <button
            type="button"
            onClick={() => cambiarMes(-1)}
            disabled={!puedeAtras}
            aria-label="Mes anterior"
            className="flex size-8 items-center justify-center rounded text-carbon hover:bg-crema disabled:text-grafito/40 disabled:hover:bg-transparent"
          >
            {'<'}
          </button>
          <button
            type="button"
            onClick={() => cambiarMes(1)}
            disabled={!puedeAdelante}
            aria-label="Mes siguiente"
            className="flex size-8 items-center justify-center rounded text-carbon hover:bg-crema disabled:text-grafito/40 disabled:hover:bg-transparent"
          >
            {'>'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-x-1 gap-y-1 text-center">
        {DIAS.map((dia) => (
          <span key={dia} className="pb-2 text-[11px] font-semibold text-grafito" aria-hidden="true">
            {dia}
          </span>
        ))}
        {celdas.map((dia, i) => {
          if (!dia) return <span key={`vacio-${i}`} />
          const texto = aTexto(dia)
          const { disponible, motivo } = estado(texto)
          const seleccionado = texto === valor
          return (
            <button
              key={texto}
              type="button"
              disabled={!disponible}
              onClick={() => onCambiar(texto)}
              aria-pressed={seleccionado}
              aria-label={`${DIAS_LARGOS[dia.getDay()]} ${dia.getDate()} de ${nombreMes(dia.getMonth()).toLowerCase()}${
                disponible ? '' : `, no disponible: ${motivo.toLowerCase()}`
              }`}
              title={disponible ? undefined : motivo}
              className={`mx-auto flex h-10 w-full max-w-12 items-center justify-center rounded-[22px] text-[13px] transition-colors ${
                seleccionado
                  ? 'bg-oro font-bold text-white'
                  : disponible
                    ? 'text-carbon hover:bg-crema hover:ring-1 hover:ring-oro'
                    : 'cursor-not-allowed border border-linea text-grafito line-through'
              }`}
            >
              {dia.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
