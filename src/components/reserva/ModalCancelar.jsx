import { useState } from 'react'
import { porcentajeReembolso } from '../../services/api.js'
import { soles } from '../../utils/fechas.js'
import BotonesModal from '../checkout/BotonesModal.jsx'
import AvisoValidacion from '../ui/AvisoValidacion.jsx'
import Modal from '../ui/Modal.jsx'

export default function ModalCancelar({ reserva, abierto, onCerrar, onConfirmar }) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const porcentaje = porcentajeReembolso(reserva)

  async function confirmar() {
    setCargando(true)
    setError('')
    try {
      await onConfirmar()
    } catch (e) {
      setError(e.message)
      setCargando(false)
    }
  }

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} bloqueado={cargando} titulo="¿Deseas cancelar tu reserva?">
      <div className="flex w-full flex-col gap-4 text-sm text-grafito">
        <p className="font-medium">Antes de continuar, ten en cuenta nuestra política de cancelación:</p>
        <ul className="flex flex-col gap-1">
          <li>• Más de 48 horas antes de la reserva: se realizará la devolución del 100 % del monto abonado.</li>
          <li>• Entre 24 y 48 horas antes de la reserva: se realizará la devolución del 50 % del monto abonado.</li>
          <li>• Menos de 24 horas antes de la reserva: el monto abonado no será reembolsable.</li>
          <li>• En caso de no presentarse a la reserva (no-show), no corresponderá devolución.</li>
        </ul>
        <p className="rounded border border-linea bg-crema p-3 text-carbon">
          Para esta reserva te corresponde una devolución del <strong>{porcentaje} %</strong> (
          {soles((reserva.monto_garantia * porcentaje) / 100)}).
        </p>
        <p className="font-semibold">
          Una vez confirmada la cancelación, recibirás por correo electrónico la información relacionada con tu
          solicitud dentro de las próximas 72 horas. Si corresponde un reembolso, este será gestionado dentro del mismo
          plazo y se te notificará por correo electrónico.
        </p>
        <p className="text-center text-base font-semibold uppercase text-oro">Esta acción no se puede deshacer.</p>
        <AvisoValidacion>{error}</AvisoValidacion>
      </div>
      <BotonesModal
        textoVolver="Volver"
        onVolver={onCerrar}
        textoConfirmar="Sí deseo cancelar"
        onConfirmar={confirmar}
        cargando={cargando}
      />
    </Modal>
  )
}
