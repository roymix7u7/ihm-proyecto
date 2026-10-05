import { Fragment } from 'react'
import { useNavigate } from 'react-router'
import AccionesPaso from '../componentes/AccionesPaso.jsx'
import CheckoutLayout from '../CheckoutLayout.jsx'
import Temporizador from '../componentes/Temporizador.jsx'
import Eyebrow from '../../../compartido/ui/Eyebrow.jsx'
import { buscarAmbientePorId } from '../../../datos/catalogos/ambientes.js'
import { parametros } from '../../../datos/catalogos/restaurante.js'
import useReserva from '../useReserva.js'
import { fechaLarga, personasTexto, soles } from '../../../compartido/fechas.js'
import { mascaraTelefono } from '../../../compartido/formularios/validaciones.js'

function BotonEditar({ onClick, que }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded border border-oro px-3 py-2 text-[11px] font-bold uppercase text-oro transition-colors hover:bg-oro hover:text-white"
    >
      Editar<span className="sr-only"> {que}</span>
    </button>
  )
}

export default function PasoResumen() {
  const { borrador, garantiaTotal } = useReserva()
  const navigate = useNavigate()
  const ambiente = buscarAmbientePorId(borrador.ambienteId)
  const { datos } = borrador

  const filas = [
    {
      que: 'ambiente',
      ruta: '/reservar/ambiente',
      contenido: (
        <div className="flex items-center gap-4 sm:gap-6">
          <img src={ambiente.imagen_portada} alt="" className="h-[70px] w-[100px] shrink-0 rounded object-cover" />
          <div className="flex flex-col gap-1">
            <Eyebrow>Ambiente</Eyebrow>
            <p className="font-serif text-[22px] text-carbon">{ambiente.nombre}</p>
          </div>
        </div>
      ),
    },
    {
      que: 'personas',
      ruta: '/reservar/personas',
      contenido: (
        <div className="flex flex-col gap-1">
          <Eyebrow>Personas</Eyebrow>
          <p className="text-base font-semibold text-carbon">{personasTexto(borrador.personas)}</p>
        </div>
      ),
    },
    {
      que: 'fecha y hora',
      ruta: '/reservar/fecha-hora',
      contenido: (
        <div className="flex flex-col gap-1.5">
          <Eyebrow>Fecha y hora</Eyebrow>
          <p className="text-[15px] text-carbon">
            {fechaLarga(borrador.fecha)} · {borrador.hora} Hrs
          </p>
        </div>
      ),
    },
    {
      que: 'datos de contacto',
      ruta: '/reservar/datos',
      contenido: (
        <div className="flex min-w-0 flex-col gap-1.5">
          <Eyebrow>Datos</Eyebrow>
          <p className="text-[15px] text-carbon">
            {datos.nombre} • +51 {mascaraTelefono(datos.telefono)}
          </p>
          <p className="text-[13px] break-all text-grafito">{datos.correo}</p>
          {datos.comentarios.trim() && (
            <p className="text-[13px] text-grafito">
              <span className="font-semibold">Solicitud especial:</span> {datos.comentarios}
            </p>
          )}
        </div>
      ),
    },
  ]

  return (
    <CheckoutLayout paso={5} titulo="Revisa tu reserva" conPanel={false}>
      <section className="flex flex-col gap-8 rounded-xl border border-linea bg-white p-6 sm:p-12">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-[28px] text-carbon sm:text-[32px]">Resumen de tu reserva</h2>
          <Eyebrow className="text-xs">Ceniza Reservas</Eyebrow>
        </div>
        <hr className="border-linea" />
        <div className="flex flex-col">
          {filas.map((fila, i) => (
            <Fragment key={fila.que}>
              {i > 0 && <hr className="border-linea/70" />}
              <div className="flex items-center justify-between gap-4 py-4">
                {fila.contenido}
                <BotonEditar onClick={() => navigate(fila.ruta)} que={fila.que} />
              </div>
            </Fragment>
          ))}
        </div>
        <hr className="border-linea" />
        <div className="flex flex-col gap-2 rounded-lg border border-linea bg-crema p-6">
          <Eyebrow className="text-xs">Monto total de garantía a pagar</Eyebrow>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="text-sm text-grafito">
              {personasTexto(borrador.personas)} × {soles(parametros.garantia_por_persona)}
            </p>
            <p className="font-serif text-[32px] leading-none text-oro">{soles(garantiaTotal)}</p>
          </div>
          <p className="text-[11px] leading-[1.4] text-grafito">
            * Este monto en adelanto se descontará de forma íntegra de tu cuenta final de consumo en el restaurante.
          </p>
        </div>
      </section>
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
        <AccionesPaso
          onAtras={() => navigate('/reservar/datos')}
          onContinuar={() => navigate('/reservar/pago')}
          textoContinuar="Continuar al pago"
        />
        <Temporizador className="hidden lg:flex" />
      </div>
    </CheckoutLayout>
  )
}
