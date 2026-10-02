import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import BotonesModal from '../../components/checkout/BotonesModal.jsx'
import EncabezadoCuenta from '../../components/cuenta/EncabezadoCuenta.jsx'
import AvisoValidacion from '../../components/ui/AvisoValidacion.jsx'
import Button from '../../components/ui/Button.jsx'
import Campo, { claseEntrada } from '../../components/ui/Campo.jsx'
import Casilla from '../../components/ui/Casilla.jsx'
import EntradaContrasena from '../../components/ui/EntradaContrasena.jsx'
import Modal from '../../components/ui/Modal.jsx'
import useAuth from '../../hooks/useAuth.js'
import useFormulario from '../../hooks/useFormulario.js'
import { solicitarRecuperacion } from '../../services/api.js'
import { destinoSeguro } from '../../utils/rutas.js'
import * as v from '../../utils/validaciones.js'

function ModalRecuperar({ abierto, onCerrar, correoInicial }) {
  const [correo, setCorreo] = useState(correoInicial)
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [cargando, setCargando] = useState(false)

  async function enviar() {
    const mensaje = v.correo(correo)
    setError(mensaje)
    if (mensaje) return
    setCargando(true)
    await solicitarRecuperacion(correo)
    setCargando(false)
    setEnviado(true)
  }

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} bloqueado={cargando} titulo="Recupera tu contraseña">
      {enviado ? (
        <>
          <AvisoValidacion tipo="exito">
            Si {correo.trim()} está registrado, recibirás un enlace para crear una nueva contraseña en los próximos
            minutos. Revisa también tu carpeta de spam.
          </AvisoValidacion>
          <Button variante="oscuro" onClick={onCerrar} className="rounded px-8 py-4 text-[13px]">
            Entendido
          </Button>
        </>
      ) : (
        <>
          <p className="text-center text-sm text-grafito">
            Escribe el correo de tu cuenta y te enviaremos un enlace para restablecerla.
          </p>
          <Campo id="correo-recuperar" etiqueta="Correo electrónico" obligatorio error={error} className="w-full">
            <input
              id="correo-recuperar"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'correo-recuperar-error' : undefined}
              autoComplete="email"
              className={claseEntrada}
            />
          </Campo>
          <BotonesModal textoVolver="Volver" onVolver={onCerrar} textoConfirmar="Enviar enlace" onConfirmar={enviar} cargando={cargando} />
        </>
      )}
    </Modal>
  )
}

export default function Login() {
  const { usuario, iniciarSesion } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [verContrasena, setVerContrasena] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')
  const [cargando, setCargando] = useState(false)
  const [recuperar, setRecuperar] = useState(false)

  const reglas = useMemo(() => ({ correo: v.correo, password: v.requerido('Ingresa tu contraseña.') }), [])
  const { valores, errores, intentoEnviar, validar, props } = useFormulario({ correo: '', password: '' }, reglas)

  const destino = destinoSeguro(params)
  const vieneDeReserva = destino.startsWith('/reservar')

  if (usuario && !cargando) return <Navigate to={destino} replace />

  async function enviar(e) {
    e.preventDefault()
    setErrorGeneral('')
    if (!validar()) return
    setCargando(true)
    try {
      await iniciarSesion(valores.correo, valores.password)
      navigate(destino, { replace: true })
    } catch (error) {
      setErrorGeneral(error.message)
      setCargando(false)
    }
  }

  const hayErrores = intentoEnviar && Object.keys(errores).length > 0

  return (
    <section className="flex flex-col items-center gap-7 px-5 pt-10 pb-12 md:px-10">
      <EncabezadoCuenta
        titulo="Inicia sesión"
        descripcion={
          vieneDeReserva
            ? 'Para reservar necesitas una cuenta. Ingresa y continuamos justo donde te quedaste.'
            : 'Accede para reservar en pocos pasos y gestionar tus reservas.'
        }
      />
      <form
        onSubmit={enviar}
        noValidate
        className="flex w-full max-w-[600px] flex-col gap-5 rounded-xl border border-linea bg-white p-6 sm:p-9"
      >
        <Campo id="correo" etiqueta="Correo electrónico" obligatorio error={errores.correo}>
          <input {...props('correo')} type="email" autoComplete="email" placeholder="nombre@correo.com" className={claseEntrada} />
        </Campo>
        <Campo id="password" etiqueta="Contraseña" obligatorio error={errores.password}>
          <EntradaContrasena
            {...props('password')}
            visible={verContrasena}
            onAlternar={() => setVerContrasena(!verContrasena)}
            autoComplete="current-password"
            placeholder="Tu contraseña"
          />
        </Campo>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Casilla id="mostrar-contrasena" checked={verContrasena} onChange={setVerContrasena}>
            Mostrar contraseña
          </Casilla>
          <button type="button" onClick={() => setRecuperar(true)} className="text-[13px] font-semibold text-oro hover:underline">
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <AvisoValidacion>{errorGeneral || (hayErrores && 'Completa los campos marcados para iniciar sesión.')}</AvisoValidacion>
        <Button type="submit" variante="oscuro" disabled={cargando} className="h-[52px] w-full rounded text-[13px]">
          {cargando ? 'Ingresando…' : 'Iniciar sesión'}
        </Button>
        <p className="text-center text-xs text-grafito">🔒 Tus datos viajan protegidos y nunca compartimos tu información.</p>
        <Button
          to={`/registro${params.get('redirect') ? `?redirect=${encodeURIComponent(destino)}` : ''}`}
          variante="contorno-oscuro"
          className="h-[52px] w-full rounded text-[13px]"
        >
          Crear cuenta
        </Button>
        <p className="text-center text-xs text-grafito">¿Aún no tienes cuenta? Regístrate gratis y reserva en menos pasos.</p>
      </form>
      <p className="max-w-[600px] rounded border border-dashed border-linea px-4 py-3 text-center text-xs text-grafito">
        <strong className="text-carbon">Cuenta de demostración:</strong> carlos.menalv@gmail.com · Ceniza2026
      </p>
      <p className="text-sm text-grafito">
        <Link to="/" className="underline-offset-2 hover:text-carbon hover:underline">
          Volver al inicio
        </Link>
      </p>
      {recuperar && <ModalRecuperar abierto onCerrar={() => setRecuperar(false)} correoInicial={valores.correo} />}
    </section>
  )
}
