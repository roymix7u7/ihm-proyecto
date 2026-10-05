import iconoCheck from '../../../assets/icons/check-leyenda.svg'
import iconoCirculo from '../../../assets/icons/circulo.svg'
import iconoReloj from '../../../assets/icons/reloj.svg'
import iconoSlash from '../../../assets/icons/slash.svg'
import Eyebrow from '../../../compartido/ui/Eyebrow.jsx'

const leyenda = [
  { icono: iconoCheck, fondo: 'bg-oro', titulo: 'Seleccionado', texto: 'Fecha y hora elegidas para continuar.' },
  { icono: iconoCirculo, fondo: 'border border-linea bg-crema', titulo: 'Disponible', texto: 'Horarios libres para reservar.' },
  { icono: iconoSlash, fondo: 'border border-linea bg-crema', titulo: 'No disponible', texto: 'Horario no disponible para reserva' },
]

export default function GrillaHorarios({ horarios, valor, onCambiar, hayFecha, conLeyenda = true }) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-linea bg-white p-5 sm:p-6">
      <h3 className="font-serif text-[22px] text-carbon">Horas Disponibles</h3>
      <div className="flex items-center justify-center rounded-lg border border-linea bg-crema px-4 py-3" aria-live="polite">
        {valor ? (
          <span className="flex items-center gap-2 rounded-full bg-oro px-3 py-2 text-xs font-bold text-white">
            <img src={iconoReloj} alt="" width="14" height="14" />
            Horario seleccionado: {valor}
          </span>
        ) : (
          <span className="text-xs text-grafito">
            {hayFecha ? 'Elige una hora para continuar' : 'Primero elige una fecha en el calendario'}
          </span>
        )}
      </div>

      {hayFecha &&
        (horarios.length > 0 ? (
          <div role="group" aria-label="Horarios" className="flex flex-wrap justify-center gap-3">
            {horarios.map(({ hora, disponible }) => {
              const seleccionado = hora === valor
              return (
                <button
                  key={hora}
                  type="button"
                  disabled={!disponible}
                  onClick={() => onCambiar(hora)}
                  aria-pressed={seleccionado}
                  aria-label={`${hora}${disponible ? '' : ', no disponible'}`}
                  className={`w-[74px] rounded py-3 text-[13px] transition-colors ${
                    seleccionado
                      ? 'bg-oro font-bold text-white'
                      : disponible
                        ? 'border border-linea text-carbon hover:border-oro'
                        : 'cursor-not-allowed border border-linea text-carbon line-through opacity-40'
                  }`}
                >
                  {hora}
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-sm text-grafito">No hay horarios para esta fecha. Prueba con otro día.</p>
        ))}

      {conLeyenda && (
        <div className="flex flex-col gap-3">
          <Eyebrow>Estados</Eyebrow>
          {leyenda.map((item) => (
            <div key={item.titulo} className="flex items-center gap-3">
              <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${item.fondo}`}>
                <img src={item.icono} alt="" width="14" height="14" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] font-bold text-carbon">{item.titulo}</p>
                <p className="text-xs text-grafito">{item.texto}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
