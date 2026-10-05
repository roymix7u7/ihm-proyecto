import { buscarAmbientePorId } from '../../../datos/catalogos/ambientes.js'
import { parametros } from '../../../datos/catalogos/restaurante.js'
import useReserva from '../useReserva.js'
import { fechaCorta, personasTexto, soles } from '../../../compartido/fechas.js'
import Eyebrow from '../../../compartido/ui/Eyebrow.jsx'

function Fila({ etiqueta, valor }) {
  return (
    <div className="flex items-start justify-between gap-4 text-[13px]">
      <dt className="text-grafito">{etiqueta}</dt>
      <dd className="text-right font-bold text-carbon">{valor}</dd>
    </div>
  )
}

// Panel lateral "Detalle de la Mesa": se va llenando a medida que avanza el flujo.
export default function ResumenMesa({ paso, sinGarantia = false }) {
  const { borrador, garantiaTotal } = useReserva()
  const ambiente = buscarAmbientePorId(borrador.ambienteId)

  return (
    <section aria-label="Resumen de tu reserva" className="flex flex-col gap-6 border border-linea bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <Eyebrow>Resumen de tu reserva</Eyebrow>
        <h2 className="font-serif text-[28px] text-carbon">Detalle de la Mesa</h2>
      </div>
      <hr className="border-linea" />
      <dl className="flex flex-col gap-4">
        {ambiente && paso > 3 && <Fila etiqueta="Ambiente" valor={ambiente.nombre} />}
        <Fila etiqueta={paso === 1 ? 'Personas seleccionadas' : 'Personas'} valor={personasTexto(borrador.personas)} />
        {paso > 1 && <Fila etiqueta="Fecha" valor={borrador.fecha ? fechaCorta(borrador.fecha) : '—'} />}
        {paso > 1 && <Fila etiqueta="Horario" valor={borrador.hora ?? '—'} />}
      </dl>
      {paso === 3 && (
        <>
          <hr className="border-linea" />
          <p className="text-center text-[13px] font-medium text-grafito">
            {ambiente ? (
              <>
                Ambiente elegido: <strong className="text-carbon">{ambiente.nombre}</strong>
              </>
            ) : (
              'Selecciona un ambiente disponible'
            )}
          </p>
        </>
      )}
      {!sinGarantia && (
        <>
          <hr className="border-linea" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4 text-[13px]">
              <span className="text-grafito">Garantía de reserva por persona</span>
              <span className={`font-bold ${paso === 1 ? 'text-oro' : 'text-carbon'}`}>
                {soles(parametros.garantia_por_persona)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-carbon">Garantía total</span>
              <span className="font-serif text-2xl text-oro" aria-live="polite">
                {soles(garantiaTotal)}
              </span>
            </div>
            <div className="text-[11px] leading-[1.4] text-grafito">
              <p>
                * Este monto pagado como garantía se descontará de forma íntegra de su cuenta final de consumo en el
                restaurante.{paso === 1 && ' La garantía se actualiza por persona.'}
              </p>
              <p>* En caso de cancelaciones aplican términos y condiciones.</p>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
