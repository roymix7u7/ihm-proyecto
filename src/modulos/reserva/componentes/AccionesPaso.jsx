import { useState } from 'react'
import { useNavigate } from 'react-router'
import useReserva from '../useReserva.js'
import Button from '../../../compartido/ui/Button.jsx'
import Modal from '../../../compartido/ui/Modal.jsx'
import BotonesModal from '../../../compartido/ui/BotonesModal.jsx'

// Fila "Salir de la reserva / Atrás / Continuar" que se repite en cada paso.
// En móvil se apila con la acción principal arriba.
export default function AccionesPaso({
  onAtras,
  onContinuar,
  textoContinuar = 'Continuar',
  deshabilitado = false,
  mostrarSalir = true,
  ayuda,
  className = '',
}) {
  const [confirmarSalida, setConfirmarSalida] = useState(false)
  const { reiniciar } = useReserva()
  const navigate = useNavigate()

  function salir() {
    reiniciar()
    navigate('/')
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:gap-5">
        {mostrarSalir && (
          <Button variante="salir" onClick={() => setConfirmarSalida(true)} className="rounded px-8 py-4 text-[13px]">
            Salir de la reserva
          </Button>
        )}
        {onAtras && (
          <Button variante="contorno-oscuro" onClick={onAtras} className="rounded px-8 py-4 text-[13px]">
            Atrás
          </Button>
        )}
        <Button
          type={onContinuar ? 'button' : 'submit'}
          variante="oscuro"
          onClick={onContinuar}
          disabled={deshabilitado}
          className="rounded border border-carbon px-8 py-4 text-[13px] disabled:border-grafito disabled:bg-grafito"
        >
          {textoContinuar}
        </Button>
      </div>
      {ayuda && <p className="text-xs leading-[1.4] text-grafito">{ayuda}</p>}

      <Modal abierto={confirmarSalida} onCerrar={() => setConfirmarSalida(false)} titulo="¿Deseas salir de la reserva?">
        <p className="text-center text-sm text-grafito">
          Se perderán los datos que ingresaste y dejaremos de guardar la disponibilidad que elegiste.
        </p>
        <BotonesModal
          textoVolver="Seguir reservando"
          onVolver={() => setConfirmarSalida(false)}
          textoConfirmar="Sí, salir"
          onConfirmar={salir}
        />
      </Modal>
    </div>
  )
}
