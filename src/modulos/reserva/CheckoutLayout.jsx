import { useNavigate } from 'react-router'
import useReserva from './useReserva.js'
import useTiempoRestante from './useTiempoRestante.js'
import Eyebrow from '../../compartido/ui/Eyebrow.jsx'
import Modal from '../../compartido/ui/Modal.jsx'
import BotonesModal from '../../compartido/ui/BotonesModal.jsx'
import ResumenMesa from './componentes/ResumenMesa.jsx'
import Stepper from './componentes/Stepper.jsx'
import Temporizador from './componentes/Temporizador.jsx'

// Estructura común de los pasos 1 a 6: barra de progreso, contenido y panel lateral con el
// resumen y el temporizador. Si el tiempo se agota, ofrece empezar de nuevo.
export default function CheckoutLayout({
  paso,
  titulo,
  descripcion,
  encabezado,
  conPanel = true,
  sinGarantia = false,
  pausarTiempo = false,
  children,
}) {
  const { expiraEn, reiniciar, iniciar } = useReserva()
  const restante = useTiempoRestante(expiraEn)
  const navigate = useNavigate()
  const agotado = restante === 0 && !pausarTiempo

  function empezarDeNuevo() {
    reiniciar()
    iniciar()
    navigate('/reservar/personas')
  }

  function volverAlInicio() {
    reiniciar()
    navigate('/')
  }

  return (
    <>
      <Stepper actual={paso} />
      <div className="flex flex-col gap-10 px-5 pt-8 pb-16 md:px-10 lg:flex-row lg:items-start lg:gap-16 lg:px-20 lg:pt-12 lg:pb-20">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          {encabezado}
          <div className="flex flex-col gap-3">
            <Eyebrow>Paso {paso} de 7</Eyebrow>
            <h1 className="font-serif text-4xl text-carbon lg:text-5xl">{titulo}</h1>
            {descripcion && <p className="text-sm leading-normal text-grafito">{descripcion}</p>}
            <Temporizador compacto className="lg:hidden" />
          </div>
          {children}
        </div>
        {conPanel && (
          <aside className="flex w-full shrink-0 flex-col gap-10 lg:sticky lg:top-[114px] lg:w-[400px]">
            <ResumenMesa paso={paso} sinGarantia={sinGarantia} />
            <Temporizador className="hidden lg:flex" />
          </aside>
        )}
      </div>

      <Modal abierto={agotado} onCerrar={volverAlInicio} titulo="Tu tiempo se agotó">
        <p className="text-center text-sm text-grafito">
          Guardamos tu selección durante 10 minutos para que nadie más tome tu mesa. Puedes empezar de nuevo cuando
          quieras: solo te tomará un momento.
        </p>
        <BotonesModal
          textoVolver="Volver al inicio"
          onVolver={volverAlInicio}
          textoConfirmar="Empezar de nuevo"
          onConfirmar={empezarDeNuevo}
        />
      </Modal>
    </>
  )
}
