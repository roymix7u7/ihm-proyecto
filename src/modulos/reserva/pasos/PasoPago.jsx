import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import iconoPlin from '../../../assets/icons/plin.svg'
import iconoSpinner from '../../../assets/icons/spinner.svg'
import iconoTarjeta from '../../../assets/icons/tarjeta.svg'
import iconoYape from '../../../assets/icons/yape.svg'
import CheckoutLayout from '../CheckoutLayout.jsx'
import AvisoValidacion from '../../../compartido/formularios/AvisoValidacion.jsx'
import Button from '../../../compartido/ui/Button.jsx'
import Campo, { claseEntrada } from '../../../compartido/formularios/Campo.jsx'
import Eyebrow from '../../../compartido/ui/Eyebrow.jsx'
import Modal from '../../../compartido/ui/Modal.jsx'
import { parametros } from '../../../datos/catalogos/restaurante.js'
import useAuth from '../../cuenta/useAuth.js'
import useFormulario from '../../../compartido/formularios/useFormulario.js'
import useReserva from '../useReserva.js'
import { pagarReserva } from '../../../datos/pagos.js'
import { personasTexto, soles } from '../../../compartido/fechas.js'
import * as v from '../../../compartido/formularios/validaciones.js'

const metodos = [
  { clave: 'tarjeta', nombre: 'Tarjeta de Crédito / Débito', icono: iconoTarjeta, ancho: 24, alto: 16 },
  { clave: 'yape', nombre: 'Yape', icono: iconoYape, ancho: 24, alto: 24 },
  { clave: 'plin', nombre: 'Plin', icono: iconoPlin, ancho: 24, alto: 24 },
]

const reglasTarjeta = {
  numero: v.numeroTarjeta,
  vencimiento: v.vencimiento,
  cvv: v.cvv,
  titular: v.nombreTarjeta,
}
const reglasBilletera = { celular: v.telefono, codigo: v.codigoAprobacion }

const soluciones = [
  { titulo: 'Verifica tus datos', texto: 'Comprueba el número de tarjeta, fecha de vencimiento y CVV.' },
  { titulo: 'Intenta de nuevo', texto: 'Revisa los datos ingresados y vuelve a intentar el pago.' },
  { titulo: 'Cambia el método', texto: 'Usa otra tarjeta o cambia a una opción de pago alternativa.' },
]

function BannerRechazo({ motivo, refBanner }) {
  return (
    <div
      ref={refBanner}
      tabIndex={-1}
      role="alert"
      className="flex flex-col gap-4 rounded-lg border border-error bg-error-suave p-5 outline-none sm:p-6"
    >
      <div className="flex items-center gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-error text-xl font-bold text-white">
          !
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="font-serif text-2xl text-error">No pudimos procesar tu pago</p>
          <p className="text-sm text-grafito">
            Verifica los datos de tu método de pago o intenta con otro método.
            {motivo && <span className="block text-xs">Motivo: {motivo}</span>}
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {soluciones.map((s) => (
          <div key={s.titulo} className="flex flex-col gap-2 rounded-lg border border-linea bg-white p-4">
            <Eyebrow>{s.titulo}</Eyebrow>
            <p className="text-sm leading-[1.4] text-grafito">{s.texto}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PasoPago() {
  const { borrador, garantiaTotal } = useReserva()
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [metodo, setMetodo] = useState('tarjeta')
  const [estado, setEstado] = useState('formulario') // formulario | procesando | rechazado
  const [motivo, setMotivo] = useState('')
  const [errorGeneral, setErrorGeneral] = useState(null)
  const refBanner = useRef(null)
  const refMetodos = useRef(null)

  const tarjeta = useFormulario({ numero: '', vencimiento: '', cvv: '', titular: '' }, reglasTarjeta)
  const billetera = useFormulario({ celular: v.mascaraTelefono(usuario.telefono), codigo: '' }, reglasBilletera)
  const formulario = metodo === 'tarjeta' ? tarjeta : billetera
  const nombreMetodo = useMemo(() => metodos.find((m) => m.clave === metodo).nombre, [metodo])

  useEffect(() => {
    if (estado === 'rechazado') refBanner.current?.focus()
  }, [estado])

  async function pagar(e) {
    e.preventDefault()
    setErrorGeneral(null)
    if (!formulario.validar()) return
    setEstado('procesando')
    try {
      const reserva = await pagarReserva(borrador, usuario, metodo, formulario.valores)
      // El borrador se limpia en la pantalla de confirmación (ver Confirmacion.jsx).
      navigate(`/reservar/confirmacion/${reserva.codigo_reserva}`, { replace: true })
    } catch (error) {
      if (error.tipo === 'rechazo') {
        setMotivo(error.message)
        setEstado('rechazado')
      } else {
        setErrorGeneral(error)
        setEstado('formulario')
      }
    }
  }

  function reintentar() {
    setEstado('formulario')
  }

  function cambiarMetodo() {
    tarjeta.setValores({ numero: '', vencimiento: '', cvv: '', titular: '' })
    billetera.setValores((actuales) => ({ ...actuales, codigo: '' }))
    setEstado('formulario')
    setTimeout(() => refMetodos.current?.querySelector('[aria-checked="true"]')?.focus())
  }

  const rechazado = estado === 'rechazado'
  const digitosTarjeta = v.soloDigitos(tarjeta.valores.numero)

  return (
    <CheckoutLayout
      paso={6}
      titulo="Realiza el adelanto de tu reserva"
      sinGarantia
      pausarTiempo={estado === 'procesando'}
      encabezado={rechazado && <BannerRechazo motivo={motivo} refBanner={refBanner} />}
    >
      {rechazado ? (
        <>
          <div className="flex flex-col gap-5 rounded-lg border border-linea bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase text-grafito">Método usado: {nombreMetodo}</p>
            {metodo === 'tarjeta' ? (
              <>
                <DatoFijo etiqueta="Número de tarjeta" valor={`${digitosTarjeta.slice(0, 4)} •••• •••• ${digitosTarjeta.slice(-4)}`} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <DatoFijo etiqueta="Fecha de vencimiento" valor={tarjeta.valores.vencimiento} />
                  <DatoFijo etiqueta="Código CVV" valor="•••" />
                </div>
              </>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <DatoFijo etiqueta="Celular" valor={`+51 ${billetera.valores.celular}`} />
                <DatoFijo etiqueta="Código de aprobación" valor="••••••" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variante="oscuro" onClick={reintentar} className="flex-1 rounded px-8 py-4 text-[13px]">
              Reintentar
            </Button>
            <Button variante="contorno-oscuro" onClick={cambiarMetodo} className="flex-1 rounded px-8 py-4 text-[13px]">
              Cambiar método
            </Button>
          </div>
        </>
      ) : (
        <form onSubmit={pagar} noValidate className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 rounded-lg border border-linea bg-white p-6">
            <p className="text-sm font-bold text-carbon">Resumen del adelanto</p>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-[15px] text-grafito">
                {personasTexto(borrador.personas)} × {soles(parametros.garantia_por_persona)} por persona
              </p>
              <p className="font-serif text-[22px] text-oro">{soles(garantiaTotal)}</p>
            </div>
            <p className="text-[13px] leading-normal text-grafito">
              Realiza un adelanto de S/ {parametros.garantia_por_persona} por persona para asegurar tu reserva. El monto
              será considerado posteriormente como parte de tu consumo.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Eyebrow className="text-xs">Método de pago</Eyebrow>
              <p className="text-[11px] text-grafito">🔒 Pago seguro</p>
            </div>
            <div ref={refMetodos} role="radiogroup" aria-label="Método de pago" className="grid gap-4 sm:grid-cols-[1.6fr_1fr_1fr]">
              {metodos.map((m) => {
                const activo = m.clave === metodo
                return (
                  <button
                    key={m.clave}
                    type="button"
                    role="radio"
                    aria-checked={activo}
                    onClick={() => setMetodo(m.clave)}
                    className={`flex items-center gap-3 rounded px-6 py-4 text-left text-sm transition-colors ${
                      activo
                        ? 'border-[1.5px] border-oro bg-oro font-semibold text-white'
                        : 'border border-linea bg-white text-grafito hover:border-oro'
                    }`}
                  >
                    <img
                      src={m.icono}
                      alt=""
                      width={m.ancho}
                      height={m.alto}
                      className={m.clave === 'tarjeta' && !activo ? 'invert' : ''}
                    />
                    {m.nombre}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-col gap-5 rounded-lg border border-linea bg-white p-6 sm:p-8">
              <AvisoValidacion>
                {errorGeneral?.message ??
                  (formulario.intentoEnviar && Object.keys(formulario.errores).length > 0 && 'Revisa los datos de pago marcados.')}
              </AvisoValidacion>
              {errorGeneral?.tipo === 'disponibilidad' && (
                <Button variante="contorno-oscuro" onClick={() => navigate('/reservar/ambiente')} className="self-start rounded px-6 py-3">
                  Elegir otro ambiente
                </Button>
              )}
              {metodo === 'tarjeta' ? (
                <>
                  <Campo id="numero" etiqueta="Número de tarjeta" error={tarjeta.errores.numero}>
                    <input
                      {...tarjeta.props('numero')}
                      onChange={(e) => tarjeta.cambiar('numero', v.mascaraTarjeta(e.target.value))}
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="0000 0000 0000 0000"
                      className={claseEntrada}
                    />
                  </Campo>
                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
                    <Campo id="vencimiento" etiqueta="Fecha de vencimiento" error={tarjeta.errores.vencimiento}>
                      <input
                        {...tarjeta.props('vencimiento')}
                        onChange={(e) => tarjeta.cambiar('vencimiento', v.mascaraVencimiento(e.target.value))}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM / AA"
                        className={claseEntrada}
                      />
                    </Campo>
                    <Campo id="cvv" etiqueta="Código CVV" error={tarjeta.errores.cvv}>
                      <input
                        {...tarjeta.props('cvv')}
                        onChange={(e) => tarjeta.cambiar('cvv', v.soloDigitos(e.target.value).slice(0, 4))}
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="Código de seguridad de 3 o 4 dígitos de tu tarjeta"
                        className={claseEntrada}
                      />
                    </Campo>
                  </div>
                  <Campo id="titular" etiqueta="Nombre en la tarjeta" error={tarjeta.errores.titular}>
                    <input
                      {...tarjeta.props('titular')}
                      onChange={(e) => tarjeta.cambiar('titular', e.target.value.toUpperCase())}
                      autoComplete="cc-name"
                      placeholder="CARLOS MENDOZA"
                      className={claseEntrada}
                    />
                  </Campo>
                </>
              ) : (
                <>
                  <p className="text-sm text-grafito">
                    Abre tu app <strong className="text-carbon">{nombreMetodo}</strong>, busca la opción “Código de
                    aprobación” y escribe aquí los 6 dígitos que aparecen.
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
                    <Campo id="celular" etiqueta={`Celular afiliado a ${nombreMetodo}`} error={billetera.errores.celular}>
                      <div className="relative">
                        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-grafito/60">
                          +51
                        </span>
                        <input
                          {...billetera.props('celular')}
                          onChange={(e) => billetera.cambiar('celular', v.mascaraTelefono(e.target.value))}
                          inputMode="numeric"
                          autoComplete="tel-national"
                          className={`${claseEntrada} pl-12`}
                        />
                      </div>
                    </Campo>
                    <Campo id="codigo" etiqueta="Código de aprobación" error={billetera.errores.codigo}>
                      <input
                        {...billetera.props('codigo')}
                        onChange={(e) => billetera.cambiar('codigo', v.soloDigitos(e.target.value).slice(0, 6))}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="000000"
                        className={`${claseEntrada} tracking-[0.3em]`}
                      />
                    </Campo>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-5">
              <Button variante="contorno-oscuro" onClick={() => navigate('/reservar/resumen')} className="rounded px-8 py-4 text-[13px]">
                Atrás
              </Button>
              <Button type="submit" variante="oscuro" className="rounded px-10 py-4 text-[13px]">
                Pagar {soles(garantiaTotal)}
              </Button>
            </div>
            <p className="text-[13px] leading-normal text-grafito opacity-80">
              Completa y valida todos los datos de pago para continuar
            </p>
          </div>

          <aside className="rounded border border-dashed border-linea p-4 text-xs leading-relaxed text-grafito">
            <strong className="text-carbon">Modo demostración:</strong> ningún cobro es real. Cualquier tarjeta válida (por
            ejemplo 4111 1111 1111 1111) aprueba el pago. Para ver un pago rechazado usa la tarjeta 4000 0000 0000 0002, o
            el código 000000 en Yape/Plin.
          </aside>
        </form>
      )}

      <Modal
        abierto={estado === 'procesando'}
        bloqueado
        titulo="Procesando tu pago..."
        icono={<img src={iconoSpinner} alt="" width="80" height="80" className="animate-spin" />}
      >
        <p className="text-center text-sm text-grafito" aria-live="polite">
          <span className="font-semibold">Esto puede tardar unos segundos.</span>
          <br />
          No cierres ni actualices esta página.
        </p>
      </Modal>
    </CheckoutLayout>
  )
}

function DatoFijo({ etiqueta, valor }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase text-carbon">{etiqueta}</p>
      <p className="rounded border border-linea bg-white px-4 py-3.5 text-sm text-grafito">{valor}</p>
    </div>
  )
}
