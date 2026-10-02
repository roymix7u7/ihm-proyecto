import { Save, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import EncabezadoCuenta from '../../components/cuenta/EncabezadoCuenta.jsx'
import AvisoValidacion from '../../components/ui/AvisoValidacion.jsx'
import Button from '../../components/ui/Button.jsx'
import Campo, { claseEntrada } from '../../components/ui/Campo.jsx'
import useAuth from '../../hooks/useAuth.js'
import useFormulario from '../../hooks/useFormulario.js'
import * as v from '../../utils/validaciones.js'

export default function EditarPerfil() {
  const { usuario, actualizarPerfil } = useAuth()
  const navigate = useNavigate()
  const [errorGeneral, setErrorGeneral] = useState('')
  const [cargando, setCargando] = useState(false)

  const reglas = useMemo(() => ({ nombre_completo: v.nombreCompleto, correo: v.correo, telefono: v.telefono }), [])
  const inicial = useMemo(
    () => ({
      nombre_completo: usuario.nombre_completo,
      correo: usuario.correo,
      telefono: v.mascaraTelefono(usuario.telefono),
    }),
    [usuario],
  )
  const { valores, errores, intentoEnviar, cambiar, setErrores, validar, props } = useFormulario(inicial, reglas)

  const sinCambios =
    valores.nombre_completo === inicial.nombre_completo &&
    valores.correo === inicial.correo &&
    valores.telefono === inicial.telefono

  async function guardar(e) {
    e.preventDefault()
    setErrorGeneral('')
    if (!validar()) return
    if (sinCambios) return navigate('/perfil')
    setCargando(true)
    try {
      await actualizarPerfil(valores)
      navigate('/perfil', { state: { mensaje: 'Tus datos se actualizaron correctamente.' } })
    } catch (error) {
      setErrorGeneral(error.message)
      if (error.campos) setErrores(error.campos)
      setCargando(false)
    }
  }

  const hayErrores = intentoEnviar && Object.keys(errores).length > 0

  return (
    <section className="flex flex-col items-center gap-7 px-5 pt-10 pb-12 md:px-10">
      <EncabezadoCuenta
        estado="Editando perfil"
        titulo="Editar perfil"
        descripcion="Actualiza tus datos de contacto. Los usaremos para confirmar tus próximas reservas."
      />
      <form
        onSubmit={guardar}
        noValidate
        className="flex w-full max-w-[720px] flex-col gap-5 rounded-xl border border-linea bg-white p-6 sm:p-9"
      >
        <Campo
          id="nombre_completo"
          etiqueta="Nombre completo"
          obligatorio
          ayuda="Así aparecerá tu nombre en tus reservas."
          error={errores.nombre_completo}
        >
          <input {...props('nombre_completo')} autoComplete="name" className={claseEntrada} />
        </Campo>
        <Campo id="correo" etiqueta="Correo electrónico" obligatorio error={errores.correo}>
          <input {...props('correo')} type="email" autoComplete="email" className={claseEntrada} />
        </Campo>
        <Campo id="telefono" etiqueta="Teléfono celular" obligatorio error={errores.telefono}>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-grafito/60">+51</span>
            <input
              {...props('telefono')}
              onChange={(e) => cambiar('telefono', v.mascaraTelefono(e.target.value))}
              inputMode="numeric"
              autoComplete="tel-national"
              className={`${claseEntrada} pl-12`}
            />
          </div>
        </Campo>
        <Campo id="dni" etiqueta="DNI" ayuda="El DNI no se puede modificar. Escríbenos a reservas@ceniza.pe si necesitas corregirlo.">
          <input id="dni" value={usuario.dni} disabled className={claseEntrada} />
        </Campo>
        <AvisoValidacion>{errorGeneral || (hayErrores && 'Revisa los campos marcados para guardar los cambios.')}</AvisoValidacion>
        <div className="grid gap-4 sm:grid-cols-2">
          <Button type="submit" variante="oscuro" disabled={cargando} className="h-[52px] rounded text-[13px]">
            <Save size={15} aria-hidden="true" />
            {cargando ? 'Guardando…' : 'Guardar cambios'}
          </Button>
          <Button to="/perfil" variante="contorno-oscuro" className="h-[52px] rounded text-[13px]">
            <X size={15} aria-hidden="true" />
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  )
}
