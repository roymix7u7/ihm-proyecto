import { useEffect } from 'react'
import { useParams } from 'react-router'
import iconoCheckLeyenda from '../../assets/icons/check-leyenda.svg'
import iconoCheckOro from '../../assets/icons/check-oro.svg'
import iconoConfirmado from '../../assets/icons/confirmado.svg'
import iconoDescargar from '../../assets/icons/descargar.svg'
import Stepper from '../../components/checkout/Stepper.jsx'
import Button from '../../components/ui/Button.jsx'
import Eyebrow from '../../components/ui/Eyebrow.jsx'
import useAuth from '../../hooks/useAuth.js'
import useReserva from '../../hooks/useReserva.js'
import { obtenerReserva } from '../../services/api.js'
import { descargarComprobante } from '../../utils/comprobante.js'
import { fechaLarga, personasTexto, soles } from '../../utils/fechas.js'
import { mascaraTelefono } from '../../utils/validaciones.js'
import Proximamente from '../Proximamente.jsx'

export default function Confirmacion() {
  const { codigo } = useParams()
  const { usuario } = useAuth()
  const { reiniciar } = useReserva()
  const reserva = obtenerReserva(codigo, usuario.id)

  // La reserva ya quedó registrada: se descarta el borrador y se detiene el temporizador.
  // Se hace aquí y no en el paso de pago porque la navegación de React Router es una transición
  // y limpiar antes haría que la protección de pasos redirija de vuelta al paso 2.
  useEffect(() => {
    reiniciar()
  }, [reiniciar])

  if (!reserva) return <Proximamente titulo="No encontramos esta reserva" etiqueta="Reserva no encontrada" />

  return (
    <>
      <Stepper actual={7} bloqueado />
      <section className="flex flex-col items-center gap-12 px-5 pt-12 pb-20 md:px-10 lg:px-[180px] lg:pt-16 lg:pb-[100px]">
        <div className="flex flex-col items-center gap-5 text-center">
          <img src={iconoConfirmado} alt="" width="80" height="80" />
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-serif text-4xl text-carbon sm:text-[56px]">¡Tu reserva está confirmada!</h1>
            <p className="flex items-center gap-2 text-sm font-semibold text-oro">
              <img src={iconoCheckOro} alt="" width="16" height="16" />
              Paso 7 de 7 completado
            </p>
            <p className="text-lg text-grafito">Te esperamos para vivir una experiencia memorable en Ceniza Alta Cocina</p>
            <p className="text-sm text-grafito opacity-70">Código de reserva: {reserva.codigo_reserva}</p>
          </div>
        </div>

        <article className="flex w-full max-w-[720px] flex-col gap-8 rounded-xl border border-linea bg-white p-6 sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <Eyebrow>Código de reserva</Eyebrow>
              <p className="text-xl font-bold text-carbon">{reserva.codigo_reserva}</p>
              <p className="text-xs text-grafito opacity-70">Preséntalo al llegar al restaurante</p>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-oro px-4 py-1.5 text-xs font-bold uppercase text-white">
              <img src={iconoCheckLeyenda} alt="" width="14" height="14" />
              Confirmada
            </span>
          </div>
          <hr className="border-linea" />
          <dl className="grid gap-6 sm:grid-cols-2 sm:gap-x-8">
            <div className="flex flex-col gap-1">
              <dt><Eyebrow>Ambiente</Eyebrow></dt>
              <dd className="font-serif text-[22px] text-carbon">{reserva.ambiente.nombre}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt><Eyebrow>Personas</Eyebrow></dt>
              <dd className="text-base font-semibold text-carbon">{personasTexto(reserva.numero_comensales)}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt><Eyebrow>Fecha y hora</Eyebrow></dt>
              <dd className="text-base font-semibold text-carbon">
                {fechaLarga(reserva.fecha)}
                <br />
                {reserva.hora} hrs
              </dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt><Eyebrow>Garantía pagada</Eyebrow></dt>
              <dd className="font-serif text-[22px] text-oro">{soles(reserva.monto_garantia)}</dd>
            </div>
          </dl>
          <hr className="border-linea/70" />
          <div className="flex flex-col gap-2">
            <Eyebrow>Información del titular</Eyebrow>
            <p className="text-[15px] font-semibold text-carbon">{reserva.contacto.nombre}</p>
            <p className="text-[13px] break-all text-grafito">
              {reserva.contacto.correo} • +51 {mascaraTelefono(reserva.contacto.telefono)}
            </p>
          </div>
          <hr className="border-linea" />
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-[380px] text-xs text-grafito">
              Se ha enviado una copia detallada de tu confirmación de reserva y comprobante al correo proporcionado.
            </p>
            <button
              type="button"
              onClick={() => descargarComprobante(reserva)}
              className="flex shrink-0 items-center gap-2 border border-linea px-6 py-3.5 text-[11px] font-bold uppercase text-grafito transition-colors hover:border-carbon hover:text-carbon"
            >
              <img src={iconoDescargar} alt="" width="14" height="14" />
              Descargar comprobante
            </button>
          </div>
        </article>

        <div className="flex w-full flex-col justify-center gap-4 sm:flex-row sm:gap-6">
          <Button to={`/mi-reserva/${reserva.codigo_reserva}`} variante="oscuro" className="rounded px-10 py-4 text-[13px]">
            Ver detalles de mi reserva
          </Button>
          <Button to="/" variante="contorno-oscuro" className="rounded px-10 py-4 text-[13px]">
            Volver al inicio
          </Button>
        </div>
      </section>
    </>
  )
}
