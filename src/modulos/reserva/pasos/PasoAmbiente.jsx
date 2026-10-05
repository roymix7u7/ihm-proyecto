import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import iconoCheckCirculo from '../../../assets/icons/check-circulo.svg'
import iconoXCirculo from '../../../assets/icons/x-circulo.svg'
import AccionesPaso from '../componentes/AccionesPaso.jsx'
import CheckoutLayout from '../CheckoutLayout.jsx'
import Button from '../../../compartido/ui/Button.jsx'
import Eyebrow from '../../../compartido/ui/Eyebrow.jsx'
import useReserva from '../useReserva.js'
import { disponibilidadAmbientes } from '../../../datos/disponibilidad.js'

function Estado({ disponible }) {
  return disponible ? (
    <span className="flex items-center gap-1.5 rounded bg-[#f3ece3] px-2.5 py-1 text-[10px] font-bold uppercase text-oro">
      <img src={iconoCheckCirculo} alt="" width="12" height="12" />
      Disponible
    </span>
  ) : (
    <span className="flex items-center gap-1.5 rounded bg-[#f5f5f5] px-2.5 py-1 text-[10px] font-bold uppercase text-grafito">
      <img src={iconoXCirculo} alt="" width="12" height="12" />
      No disponible
    </span>
  )
}

export default function PasoAmbiente() {
  const { borrador, actualizar } = useReserva()
  const navigate = useNavigate()
  const { fecha, hora, personas, ambienteId, ambientePreferido } = borrador

  const opciones = useMemo(() => disponibilidadAmbientes(fecha, hora, personas), [fecha, hora, personas])
  const elegidoDisponible = opciones.some((o) => o.ambiente.id === ambienteId && o.disponible)

  // Si lo elegido dejó de estar disponible (cambió la fecha o las personas), se libera;
  // si no hay nada elegido, se preselecciona el ambiente desde el que se empezó a reservar.
  useEffect(() => {
    if (ambienteId && !elegidoDisponible) actualizar({ ambienteId: null })
    if (!ambienteId && ambientePreferido && opciones.some((o) => o.ambiente.id === ambientePreferido && o.disponible)) {
      actualizar({ ambienteId: ambientePreferido })
    }
  }, [ambienteId, ambientePreferido, elegidoDisponible, opciones, actualizar])

  return (
    <CheckoutLayout paso={3} titulo="Elige tu ambiente">
      <ul className="flex flex-col gap-8">
        {opciones.map(({ ambiente, disponible, motivo }) => {
          const elegido = ambiente.id === ambienteId && disponible
          return (
            <li
              key={ambiente.id}
              className={`flex flex-col gap-6 rounded-xl border bg-white p-5 transition-shadow sm:flex-row sm:gap-8 sm:p-6 ${
                elegido ? 'border-oro ring-2 ring-oro/40' : 'border-linea'
              } ${disponible ? '' : 'opacity-90'}`}
            >
              <img
                src={ambiente.imagen_portada}
                alt={`Ambiente ${ambiente.nombre}`}
                className={`h-48 w-full shrink-0 rounded-lg object-cover sm:h-[200px] sm:w-[280px] ${disponible ? '' : 'grayscale-[40%]'}`}
              />
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Eyebrow>{ambiente.categoria}</Eyebrow>
                    <Estado disponible={disponible} />
                  </div>
                  <h2 className="font-serif text-[28px] text-carbon">{ambiente.nombre}</h2>
                  <p className="text-sm leading-normal text-grafito">{ambiente.resumen}</p>
                </div>
                {disponible ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <a
                      href={`/ambientes/${ambiente.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-grafito underline-offset-2 hover:text-carbon hover:underline"
                    >
                      Vive la experiencia
                      <span className="sr-only"> de {ambiente.nombre} (se abre en una pestaña nueva)</span>
                    </a>
                    <Button
                      variante={elegido ? 'oscuro' : 'oro'}
                      onClick={() => actualizar({ ambienteId: ambiente.id })}
                      aria-pressed={elegido}
                      className="rounded px-6 py-3"
                    >
                      {elegido ? '✓ Ambiente elegido' : 'Elegir este ambiente'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="max-w-[240px] text-xs font-light text-grafito">{motivo}</p>
                    <button
                      type="button"
                      onClick={() => navigate('/reservar/fecha-hora')}
                      className="rounded border border-linea px-4 py-2.5 text-[11px] font-bold uppercase text-grafito hover:border-carbon hover:text-carbon"
                    >
                      Volver a pasos anteriores
                    </button>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <p className="text-[13px] text-grafito">
        * La disponibilidad se confirma según fecha y horario seleccionados en los pasos anteriores. Si un ambiente no
        está disponible, puedes editar tu selección o continuar con una alternativa.
      </p>
      <AccionesPaso
        onAtras={() => navigate('/reservar/fecha-hora')}
        onContinuar={() => navigate('/reservar/datos')}
        deshabilitado={!elegidoDisponible}
        ayuda={elegidoDisponible ? undefined : 'Elige un ambiente disponible para continuar.'}
      />
    </CheckoutLayout>
  )
}
