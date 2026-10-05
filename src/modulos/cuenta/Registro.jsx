import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router'
import EncabezadoCuenta from './EncabezadoCuenta.jsx'
import AvisoValidacion from '../../compartido/formularios/AvisoValidacion.jsx'
import Button from '../../compartido/ui/Button.jsx'
import Campo, { claseEntrada } from '../../compartido/formularios/Campo.jsx'
import Casilla from '../../compartido/formularios/Casilla.jsx'
import EntradaContrasena from '../../compartido/formularios/EntradaContrasena.jsx'
import useAuth from './useAuth.js'
import useFormulario from '../../compartido/formularios/useFormulario.js'
import { destinoSeguro } from './destinoSeguro.js'
import * as v from '../../compartido/formularios/validaciones.js'

const inicial = { nombre_completo: '', dni: '', correo: '', telefono: '', password: '', confirmacion: '' }

export default function Registro() {
  const { usuario, registrar } = useAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [verContrasena, setVerContrasena] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')
  const [cargando, setCargando] = useState(false)

  const reglas = useMemo(
    () => ({
      nombre_completo: v.nombreCompleto,
      dni: v.dni,
      correo: v.correo,
      telefono: v.telefono,
      password: v.contrasena,
      confirmacion: (valor, todos) => v.confirmarContrasena(valor, todos.password),
    }),
    [],
  )
  const { valores, errores, intentoEnviar, cambiar, setErrores, validar, props } = useFormulario(inicial, reglas)
  const destino = destinoSeguro(params)

  if (usuario && !cargando) return <Navigate to={destino} replace />

  async function enviar(e) {
    e.preventDefault()
    setErrorGeneral('')
    if (!validar()) return
    setCargando(true)
    try {
      await registrar(valores)
      navigate(destino, { replace: true })
    } catch (error) {
      setErrorGeneral(error.message)
      if (error.campos) setErrores(error.campos)
      setCargando(false)
    }
  }

  const hayErrores = intentoEnviar && Object.keys(errores).length > 0

  return (
    <section className="flex flex-col items-center gap-7 px-5 pt-10 pb-12 md:px-10">
      <EncabezadoCuenta titulo="Crea tu cuenta" descripcion="Regístrate una vez y reserva tu mesa en pocos pasos." />
      <form
        onSubmit={enviar}
        noValidate
        className="flex w-full max-w-[600px] flex-col gap-5 rounded-xl border border-linea bg-white p-6 sm:p-9"
      >
        <Campo id="nombre_completo" etiqueta="Nombre completo" obligatorio error={errores.nombre_completo}>
          <input {...props('nombre_completo')} autoComplete="name" placeholder="Nombres y apellidos" className={claseEntrada} />
        </Campo>
        <Campo id="dni" etiqueta="DNI" obligatorio error={errores.dni}>
          <input
            {...props('dni')}
            onChange={(e) => cambiar('dni', v.soloDigitos(e.target.value).slice(0, 8))}
            inputMode="numeric"
            placeholder="8 dígitos"
            className={claseEntrada}
          />
        </Campo>
        <Campo id="correo" etiqueta="Correo electrónico" obligatorio error={errores.correo}>
          <input {...props('correo')} type="email" autoComplete="email" placeholder="nombre@correo.com" className={claseEntrada} />
        </Campo>
        <Campo id="telefono" etiqueta="Teléfono" obligatorio error={errores.telefono}>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-grafito/60">+51</span>
            <input
              {...props('telefono')}
              onChange={(e) => cambiar('telefono', v.mascaraTelefono(e.target.value))}
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="Ingresa tu número de teléfono"
              className={`${claseEntrada} pl-12`}
            />
          </div>
        </Campo>
        <Campo
          id="password"
          etiqueta="Contraseña"
          obligatorio
          error={errores.password}
          ayuda="Mínimo 8 caracteres, combinando letras y números."
        >
          <EntradaContrasena
            {...props('password')}
            visible={verContrasena}
            onAlternar={() => setVerContrasena(!verContrasena)}
            autoComplete="new-password"
          />
        </Campo>
        <Campo id="confirmacion" etiqueta="Confirmar contraseña" obligatorio error={errores.confirmacion}>
          <EntradaContrasena
            {...props('confirmacion')}
            visible={verContrasena}
            onAlternar={() => setVerContrasena(!verContrasena)}
            autoComplete="new-password"
          />
        </Campo>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Casilla id="mostrar-contrasena" checked={verContrasena} onChange={setVerContrasena}>
            Mostrar contraseña
          </Casilla>
          <Link
            to={`/login${params.get('redirect') ? `?redirect=${encodeURIComponent(destino)}` : ''}`}
            className="text-[13px] font-semibold text-oro hover:underline"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
        <AvisoValidacion>{errorGeneral || (hayErrores && 'Revisa los campos marcados para crear tu cuenta.')}</AvisoValidacion>
        <Button type="submit" variante="oscuro" disabled={cargando} className="h-[52px] w-full rounded text-[13px]">
          {cargando ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
        <p className="text-center text-xs text-grafito">
          🔒 Usamos tus datos solo para gestionar tus reservas. Al registrarte aceptas nuestros términos y política de
          privacidad.
        </p>
      </form>
    </section>
  )
}
