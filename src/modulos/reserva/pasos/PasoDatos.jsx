import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import AccionesPaso from '../componentes/AccionesPaso.jsx'
import CheckoutLayout from '../CheckoutLayout.jsx'
import AvisoValidacion from '../../../compartido/formularios/AvisoValidacion.jsx'
import Campo, { claseEntrada } from '../../../compartido/formularios/Campo.jsx'
import useAuth from '../../cuenta/useAuth.js'
import useFormulario from '../../../compartido/formularios/useFormulario.js'
import useReserva from '../useReserva.js'
import * as v from '../../../compartido/formularios/validaciones.js'

const MAX_COMENTARIOS = 300

export default function PasoDatos() {
  const { borrador, actualizar } = useReserva()
  const { usuario } = useAuth()
  const navigate = useNavigate()

  // Se precargan los datos de la cuenta; el usuario puede cambiarlos solo para esta reserva.
  const [inicial] = useState(() => ({
    nombre: borrador.datos.nombre || usuario.nombre_completo,
    telefono: v.mascaraTelefono(borrador.datos.telefono || usuario.telefono),
    correo: borrador.datos.correo || usuario.correo,
    comentarios: borrador.datos.comentarios,
  }))
  const reglas = useMemo(
    () => ({
      nombre: v.nombreCompleto,
      telefono: v.telefono,
      correo: v.correo,
      comentarios: v.maximo(MAX_COMENTARIOS),
    }),
    [],
  )
  const { valores, errores, intentoEnviar, cambiar, validar, props } = useFormulario(inicial, reglas)

  function guardar(destino) {
    actualizar({ datos: valores })
    navigate(destino)
  }

  function continuar(e) {
    e.preventDefault()
    if (validar()) guardar('/reservar/resumen')
  }

  const hayErrores = intentoEnviar && Object.keys(errores).length > 0

  return (
    <CheckoutLayout
      paso={4}
      titulo="Tus datos de contacto"
      descripcion="Confirma los datos de contacto asociados a tu cuenta, en caso desees modificarlo podrás hacerlo."
    >
      <form onSubmit={continuar} noValidate className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 rounded-xl border border-linea bg-white p-6 sm:p-10">
          <AvisoValidacion>{hayErrores && 'Revisa los campos marcados para continuar.'}</AvisoValidacion>
          <Campo id="nombre" etiqueta="Nombre completo" obligatorio error={errores.nombre}>
            <input {...props('nombre')} autoComplete="name" className={`${claseEntrada} bg-crema`} />
          </Campo>
          <div className="grid gap-6 sm:grid-cols-2">
            <Campo id="telefono" etiqueta="Teléfono" obligatorio ayuda="Ej. +51 987 654 321" error={errores.telefono}>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-grafito/60">
                  +51
                </span>
                <input
                  {...props('telefono')}
                  onChange={(e) => cambiar('telefono', v.mascaraTelefono(e.target.value))}
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="987 654 321"
                  className={`${claseEntrada} pl-12`}
                />
              </div>
            </Campo>
            <Campo id="correo" etiqueta="Correo electrónico" obligatorio error={errores.correo}>
              <input {...props('correo')} type="email" autoComplete="email" className={claseEntrada} />
            </Campo>
          </div>
          <Campo
            id="comentarios"
            etiqueta="Solicitudes especiales"
            opcional
            error={errores.comentarios}
            ayuda={`${valores.comentarios.length}/${MAX_COMENTARIOS} caracteres`}
          >
            <textarea
              {...props('comentarios')}
              rows={4}
              maxLength={MAX_COMENTARIOS + 20}
              placeholder="Ej. Alergias, intolerancias alimentarias, aniversarios, cumpleaños, preferencia de mesa o detalle especial."
              className={`${claseEntrada} min-h-[100px] resize-y bg-crema`}
            />
          </Campo>
        </div>
        <AccionesPaso onAtras={() => guardar('/reservar/ambiente')} />
      </form>
    </CheckoutLayout>
  )
}
