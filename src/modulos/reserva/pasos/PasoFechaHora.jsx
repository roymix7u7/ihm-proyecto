import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import AccionesPaso from '../componentes/AccionesPaso.jsx'
import Calendario from '../componentes/Calendario.jsx'
import CheckoutLayout from '../CheckoutLayout.jsx'
import GrillaHorarios from '../componentes/GrillaHorarios.jsx'
import useReserva from '../useReserva.js'
import { estadoFecha, horariosDisponibles, rangoFechas } from '../../../datos/disponibilidad.js'

export default function PasoFechaHora() {
  const { borrador, actualizar } = useReserva()
  const navigate = useNavigate()
  const { fecha, hora, personas } = borrador
  const { minima, maxima } = rangoFechas()

  const horarios = useMemo(() => (fecha ? horariosDisponibles(fecha, personas) : []), [fecha, personas])

  function elegirFecha(nueva) {
    const sigueLibre = horariosDisponibles(nueva, personas).some((h) => h.hora === hora && h.disponible)
    actualizar({ fecha: nueva, hora: sigueLibre ? hora : null })
  }

  const horaValida = horarios.some((h) => h.hora === hora && h.disponible)
  const listo = Boolean(fecha && horaValida)

  return (
    <CheckoutLayout paso={2} titulo="Selecciona fecha y horario">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">
        <Calendario valor={fecha} onCambiar={elegirFecha} estado={estadoFecha} minima={minima} maxima={maxima} />
        <GrillaHorarios
          horarios={horarios}
          valor={horaValida ? hora : null}
          onCambiar={(nueva) => actualizar({ hora: nueva })}
          hayFecha={Boolean(fecha)}
        />
      </div>
      <AccionesPaso
        onAtras={() => navigate('/reservar/personas')}
        onContinuar={() => navigate('/reservar/ambiente')}
        deshabilitado={!listo}
        ayuda={
          listo
            ? undefined
            : 'Elige una fecha disponible y luego un horario para continuar. Atendemos de martes a domingo.'
        }
      />
    </CheckoutLayout>
  )
}
