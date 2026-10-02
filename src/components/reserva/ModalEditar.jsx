import { useMemo, useState } from 'react'
import { estadoFecha, horariosParaAmbiente, rangoFechas } from '../../services/api.js'
import { maximo } from '../../utils/validaciones.js'
import BotonesModal from '../checkout/BotonesModal.jsx'
import Calendario from '../checkout/Calendario.jsx'
import GrillaHorarios from '../checkout/GrillaHorarios.jsx'
import AvisoValidacion from '../ui/AvisoValidacion.jsx'
import Campo, { claseEntrada } from '../ui/Campo.jsx'
import Modal from '../ui/Modal.jsx'

const MAX_COMENTARIOS = 300

// Permite reprogramar fecha y hora (en el mismo ambiente y con las mismas personas) y editar la solicitud especial.
export default function ModalEditar({ reserva, abierto, onCerrar, onGuardar }) {
  const [fecha, setFecha] = useState(reserva.fecha)
  const [hora, setHora] = useState(reserva.hora)
  const [comentarios, setComentarios] = useState(reserva.comentarios)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const { minima, maxima } = rangoFechas()

  const horarios = useMemo(
    () => horariosParaAmbiente(fecha, reserva.numero_comensales, reserva.ambientes_id, reserva.id),
    [fecha, reserva],
  )
  const horaValida = horarios.some((h) => h.hora === hora && h.disponible)
  const errorComentarios = maximo(MAX_COMENTARIOS)(comentarios)
  const sinCambios = fecha === reserva.fecha && hora === reserva.hora && comentarios === reserva.comentarios

  async function guardar() {
    setError('')
    if (!horaValida) return setError('Elige un horario disponible para tu ambiente.')
    if (errorComentarios) return setError(errorComentarios)
    if (sinCambios) return onCerrar()
    setCargando(true)
    try {
      await onGuardar({ fecha, hora, comentarios })
    } catch (e) {
      setError(e.message)
      setCargando(false)
    }
  }

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} bloqueado={cargando} titulo="Editar tu reserva" className="max-w-[860px]">
      <p className="text-center text-sm text-grafito">
        Puedes cambiar la fecha, la hora y tu solicitud especial. Para cambiar el número de personas o el ambiente, cancela
        esta reserva y crea una nueva.
      </p>
      <div className="grid w-full gap-6 md:grid-cols-[minmax(0,1fr)_300px]">
        <Calendario
          valor={fecha}
          onCambiar={(nueva) => {
            setFecha(nueva)
            setHora(null)
          }}
          estado={estadoFecha}
          minima={minima}
          maxima={maxima}
        />
        <GrillaHorarios
          horarios={horarios}
          valor={horaValida ? hora : null}
          onCambiar={setHora}
          hayFecha={Boolean(fecha)}
          conLeyenda={false}
        />
      </div>
      <Campo
        id="comentarios-edicion"
        etiqueta="Solicitudes especiales"
        opcional
        className="w-full"
        ayuda={`${comentarios.length}/${MAX_COMENTARIOS} caracteres`}
        error={errorComentarios}
      >
        <textarea
          id="comentarios-edicion"
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          rows={3}
          className={`${claseEntrada} resize-y bg-crema`}
        />
      </Campo>
      <div className="w-full">
        <AvisoValidacion>{error}</AvisoValidacion>
      </div>
      <BotonesModal textoVolver="Volver" onVolver={onCerrar} textoConfirmar="Guardar cambios" onConfirmar={guardar} cargando={cargando} />
    </Modal>
  )
}
