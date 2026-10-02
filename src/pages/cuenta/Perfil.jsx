import { CalendarCheck, IdCard, LogOut, Mail, Pencil, Phone, UserRound } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import EncabezadoCuenta from '../../components/cuenta/EncabezadoCuenta.jsx'
import AvisoValidacion from '../../components/ui/AvisoValidacion.jsx'
import Button from '../../components/ui/Button.jsx'
import useAuth from '../../hooks/useAuth.js'
import useReserva from '../../hooks/useReserva.js'
import { mascaraTelefono } from '../../utils/validaciones.js'

export default function Perfil() {
  const { usuario, cerrarSesion } = useAuth()
  const { reiniciar } = useReserva()
  const navigate = useNavigate()
  const { state } = useLocation()

  const datos = [
    { icono: UserRound, etiqueta: 'Nombre completo', valor: usuario.nombre_completo },
    { icono: Mail, etiqueta: 'Correo electrónico', valor: usuario.correo },
    { icono: IdCard, etiqueta: 'DNI', valor: usuario.dni },
    { icono: Phone, etiqueta: 'Teléfono celular', valor: `+51 ${mascaraTelefono(usuario.telefono)}` },
  ]

  function salir() {
    cerrarSesion()
    reiniciar()
    navigate('/', { replace: true })
  }

  return (
    <section className="flex flex-col items-center gap-8 px-5 pt-12 pb-12 md:px-10 lg:pt-14">
      <EncabezadoCuenta
        estado="Sesión activa"
        titulo={`Hola, ${usuario.nombre_completo.split(' ')[0]}`}
        descripcion="Estos son los datos que usamos para tus reservas."
      />
      {state?.mensaje && (
        <div className="w-full max-w-[680px]">
          <AvisoValidacion tipo="exito">{state.mensaje}</AvisoValidacion>
        </div>
      )}
      <dl className="w-full max-w-[680px] divide-y divide-linea rounded-xl border border-linea bg-white px-6 py-2 sm:px-10 sm:py-4">
        {datos.map(({ icono: Icono, etiqueta, valor }) => (
          <div key={etiqueta} className="flex items-center gap-4 py-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-linea bg-crema text-oro">
              <Icono size={18} aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-[11px] font-bold uppercase text-grafito">{etiqueta}</dt>
              <dd className="text-base break-words text-carbon">{valor}</dd>
            </div>
          </div>
        ))}
      </dl>
      <div className="grid w-full max-w-[680px] gap-4 sm:grid-cols-2">
        <Button to="/perfil/editar" variante="oscuro" className="h-[52px] rounded text-[13px]">
          <Pencil size={15} aria-hidden="true" />
          Editar perfil
        </Button>
        <Button variante="contorno-oscuro" onClick={salir} className="h-[52px] rounded text-[13px]">
          <LogOut size={15} aria-hidden="true" />
          Cerrar sesión
        </Button>
      </div>
      <Link
        to="/mi-reserva"
        className="flex items-center gap-2 text-sm font-semibold text-oro underline-offset-4 hover:underline"
      >
        <CalendarCheck size={16} aria-hidden="true" />
        Ver mis reservas
      </Link>
    </section>
  )
}
