import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import iconoDescargar from '../assets/icons/descargar.svg'
import iconoFlechaIzquierda from '../assets/icons/flecha-izquierda.svg'
import iconoLapiz from '../assets/icons/lapiz.svg'
import iconoPapelera from '../assets/icons/papelera.svg'
import ModalCancelar from '../components/reserva/ModalCancelar.jsx'
import ModalEditar from '../components/reserva/ModalEditar.jsx'
import AvisoValidacion from '../components/ui/AvisoValidacion.jsx'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import Button from '../components/ui/Button.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import useAuth from '../hooks/useAuth.js'
import { cancelarReserva, esFutura, reprogramarReserva, reservasDeUsuario } from '../services/api.js'
import { descargarComprobante } from '../utils/comprobante.js'
import { fechaCorta, fechaLargaConComa, soles } from '../utils/fechas.js'
import { mascaraTelefono } from '../utils/validaciones.js'

const estilosEstado = {
  confirmada: { texto: 'Confirmada', clase: 'border-oro bg-[#f3ece3] text-oro', punto: 'bg-oro' },
  cancelada: { texto: 'Cancelada', clase: 'border-grafito/40 bg-[#f5f5f5] text-grafito', punto: 'bg-grafito' },
  completada: { texto: 'Completada', clase: 'border-linea bg-crema text-grafito', punto: 'bg-grafito/60' },
}

function estadoVisible(reserva) {
  if (reserva.estado === 'cancelada') return 'cancelada'
  return esFutura(reserva) ? 'confirmada' : 'completada'
}

// Prioridad: la del código en la URL; si no, la próxima confirmada; si no, la última.
function elegirReserva(reservas, codigo) {
  if (codigo) return reservas.find((r) => r.codigo_reserva === codigo)
  return reservas.find((r) => estadoVisible(r) === 'confirmada') ?? reservas.at(-1)
}

function Dato({ etiqueta, children }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[10px] font-bold uppercase text-grafito">{etiqueta}</dt>
      <dd className="font-serif text-[22px] text-carbon">{children}</dd>
    </div>
  )
}

const claseAccion =
  'flex items-center justify-center gap-2 border px-6 py-3.5 text-[11px] font-bold uppercase text-grafito transition-colors'

export default function MiReserva() {
  const { codigo } = useParams()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [reservas, setReservas] = useState(() => reservasDeUsuario(usuario.id))
  const [modal, setModal] = useState(null) // 'editar' | 'cancelar'
  const [mensaje, setMensaje] = useState('')

  const reserva = elegirReserva(reservas, codigo)
  const estado = reserva && estadoVisible(reserva)
  const editable = estado === 'confirmada'

  async function cancelar() {
    const actualizada = await cancelarReserva(reserva.id, usuario.id)
    setReservas(reservasDeUsuario(usuario.id))
    setModal(null)
    setMensaje(
      `Tu reserva ${actualizada.codigo_reserva} fue cancelada. ${
        actualizada.reembolso.porcentaje
          ? `Te devolveremos ${soles(actualizada.reembolso.monto)} (${actualizada.reembolso.porcentaje} %) en un plazo de 72 horas.`
          : 'Según la política de cancelación, el monto abonado no es reembolsable.'
      }`,
    )
  }

  async function reprogramar(cambios) {
    await reprogramarReserva(reserva.id, usuario.id, cambios)
    setReservas(reservasDeUsuario(usuario.id))
    setModal(null)
    setMensaje(`Listo, guardamos los cambios. Te esperamos el ${fechaLargaConComa(cambios.fecha)} a las ${cambios.hora} hrs.`)
  }

  return (
    <section className="flex flex-col items-center gap-10 px-5 pt-12 pb-20 md:px-10 lg:px-20 lg:pt-16 lg:pb-[100px]">
      <div className="flex w-full max-w-[720px] flex-col items-center gap-4 text-center">
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Mi Reserva' }]} />
        <h1 className="font-serif text-4xl text-carbon sm:text-[56px]">Su Reserva Gastronómica</h1>
        <p className="text-sm text-grafito">Le esperamos para celebrar el arte culinario del fuego y la memoria.</p>
      </div>

      {reservas.length > 1 && (
        <nav aria-label="Tus reservas" className="w-full max-w-[720px]">
          <Eyebrow>Tus reservas</Eyebrow>
          <ul className="mt-3 flex flex-wrap gap-2">
            {reservas.map((r) => {
              const activa = r.id === reserva?.id
              return (
                <li key={r.id}>
                  <Link
                    to={`/mi-reserva/${r.codigo_reserva}`}
                    aria-current={activa ? 'page' : undefined}
                    className={`flex flex-col rounded border px-3 py-2 text-left text-xs transition-colors ${
                      activa ? 'border-oro bg-white' : 'border-linea hover:border-oro'
                    }`}
                  >
                    <span className="font-bold text-carbon">{r.codigo_reserva}</span>
                    <span className="text-grafito">
                      {fechaCorta(r.fecha)} · {estilosEstado[estadoVisible(r)].texto}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}

      {mensaje && (
        <div className="w-full max-w-[720px]">
          <AvisoValidacion tipo="exito">{mensaje}</AvisoValidacion>
        </div>
      )}

      {!reserva ? (
        <div className="flex w-full max-w-[720px] flex-col items-center gap-6 border border-linea bg-white p-10 text-center sm:p-12">
          <h2 className="font-serif text-[32px] text-carbon">
            {codigo ? 'No encontramos esta reserva' : 'Aún no tienes reservas'}
          </h2>
          <p className="text-sm text-grafito">
            {codigo
              ? 'Revisa el código o elige una de tus reservas.'
              : 'Elige tu fecha, horario y ambiente favorito en pocos pasos.'}
          </p>
          <Button to="/reservar" variante="oro" className="px-8 py-[18px]">
            Reservar una mesa
          </Button>
        </div>
      ) : (
        <>
          <article className="flex w-full max-w-[720px] flex-col gap-8 border border-linea bg-white p-6 sm:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1 font-bold">
                <p className="text-[10px] uppercase text-oro">Código de reserva</p>
                <p className="text-lg text-carbon">{reserva.codigo_reserva}</p>
              </div>
              <span
                className={`flex items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase ${estilosEstado[estado].clase}`}
              >
                <span className={`size-2 rounded-full ${estilosEstado[estado].punto}`} aria-hidden="true" />
                {estilosEstado[estado].texto}
              </span>
            </div>
            <hr className="border-linea" />
            <dl className="flex flex-col gap-4">
              <Dato etiqueta="Fecha">{fechaLargaConComa(reserva.fecha)}</Dato>
              <Dato etiqueta="Hora">{reserva.hora} hrs</Dato>
              <Dato etiqueta="Número de personas">{reserva.numero_comensales} Personas</Dato>
            </dl>
            <div className="flex flex-col gap-4 border border-linea bg-crema p-5 sm:flex-row sm:items-center sm:gap-6">
              <img
                src={reserva.ambiente.imagen_reserva}
                alt={`Ambiente ${reserva.ambiente.nombre}`}
                className="h-40 w-full object-cover sm:h-20 sm:w-[120px]"
              />
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase text-oro">Ambiente seleccionado</p>
                <p className="font-serif text-xl text-carbon">{reserva.ambiente.nombre}</p>
                <p className="text-xs text-grafito">{reserva.ambiente.ubicacion}</p>
              </div>
            </div>
            {reserva.comentarios && (
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase text-grafito">Solicitud especial</p>
                <p className="text-sm text-carbon">{reserva.comentarios}</p>
              </div>
            )}
            <hr className="border-linea" />
            <div className="flex flex-col justify-between gap-8 sm:flex-row">
              <div className="flex flex-col gap-4">
                <Eyebrow>Detalles del cliente</Eyebrow>
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-semibold text-carbon">{reserva.contacto.nombre}</p>
                  <p className="text-[13px] break-all text-grafito">{reserva.contacto.correo}</p>
                  <p className="text-[13px] text-grafito">+51 {mascaraTelefono(reserva.contacto.telefono)}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:items-end sm:text-right">
                <Eyebrow>Garantía pagada</Eyebrow>
                <div className="flex flex-col gap-1.5 sm:items-end">
                  <p className="text-lg font-bold text-carbon">{soles(reserva.monto_garantia)}</p>
                  <p className="text-[11px] font-semibold uppercase text-exito">✓ Pago verificado</p>
                </div>
                <p className="text-[10px] uppercase text-carbon">
                  {estado === 'cancelada'
                    ? reserva.reembolso?.porcentaje
                      ? `Reembolso: ${soles(reserva.reembolso.monto)} (${reserva.reembolso.porcentaje} %)`
                      : 'Sin reembolso según la política'
                    : 'Este monto será descontado del consumo final'}
                </p>
              </div>
            </div>
            <hr className="border-linea" />
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-bold uppercase text-carbon">Notas importantes</p>
              <p className="text-xs leading-normal text-grafito">
                • Agradecemos puntualidad absoluta. Su mesa se mantendrá reservada por un máximo de 15 minutos de
                tolerancia.
              </p>
              <p className="text-xs leading-normal text-grafito">
                • El código de vestimenta es elegante formal (Smart Casual). No se permite el ingreso en calzado deportivo
                de playa ni bermudas.
              </p>
            </div>
          </article>

          <div className="grid w-full max-w-[720px] grid-cols-2 gap-3 sm:flex sm:w-auto sm:max-w-none sm:justify-center sm:gap-5">
            <button type="button" onClick={() => descargarComprobante(reserva)} className={`${claseAccion} col-span-2 border-linea hover:border-carbon hover:text-carbon`}>
              <img src={iconoDescargar} alt="" width="14" height="14" />
              Descargar comprobante
            </button>
            {editable && (
              <>
                <button type="button" onClick={() => setModal('editar')} className={`${claseAccion} border-linea hover:border-carbon hover:text-carbon`}>
                  <img src={iconoLapiz} alt="" width="14" height="14" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => setModal('cancelar')}
                  className={`${claseAccion} border-[#ea9000] bg-[#f6ddb4] hover:bg-[#f2cf96]`}
                >
                  <img src={iconoPapelera} alt="" width="14" height="14" />
                  Cancelar
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`${claseAccion} col-span-2 border-linea hover:border-carbon hover:text-carbon`}
            >
              <img src={iconoFlechaIzquierda} alt="" width="14" height="14" />
              Volver
            </button>
          </div>

          {modal === 'editar' && (
            <ModalEditar key={reserva.id} reserva={reserva} abierto onCerrar={() => setModal(null)} onGuardar={reprogramar} />
          )}
          {modal === 'cancelar' && (
            <ModalCancelar reserva={reserva} abierto onCerrar={() => setModal(null)} onConfirmar={cancelar} />
          )}
        </>
      )}
    </section>
  )
}
