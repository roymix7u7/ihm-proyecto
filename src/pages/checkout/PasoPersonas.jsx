import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import AccionesPaso from '../../components/checkout/AccionesPaso.jsx'
import CheckoutLayout from '../../components/checkout/CheckoutLayout.jsx'
import { buscarAmbiente } from '../../data/ambientes.js'
import { parametros } from '../../data/restaurante.js'
import useReserva from '../../hooks/useReserva.js'

const { personas_minimo: MIN, personas_maximo: MAX, garantia_por_persona: GARANTIA } = parametros

function BotonContador({ onClick, disabled, etiqueta, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={etiqueta}
      className="flex size-14 items-center justify-center rounded-full border-[1.5px] border-linea bg-arena text-2xl font-light text-grafito transition-colors hover:border-oro hover:text-carbon disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-linea"
    >
      {children}
    </button>
  )
}

export default function PasoPersonas() {
  const { borrador, actualizar, iniciar } = useReserva()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { personas } = borrador

  // Si se llegó desde "Reservar mesa" de un ambiente, se recuerda como preferido.
  useEffect(() => {
    const preferido = buscarAmbiente(params.get('ambiente'))
    if (preferido) iniciar(preferido.id)
  }, [params, iniciar])

  const cambiar = (delta) => actualizar({ personas: Math.min(MAX, Math.max(MIN, personas + delta)) })

  return (
    <CheckoutLayout paso={1} titulo="¿Para cuántas personas deseas reservar?">
      <div className="flex flex-col items-center gap-6 rounded-xl border border-linea bg-white p-8 sm:p-12">
        <div className="flex items-center gap-8 sm:gap-10">
          <BotonContador onClick={() => cambiar(-1)} disabled={personas <= MIN} etiqueta="Quitar una persona">
            –
          </BotonContador>
          <output aria-live="polite" aria-label={`${personas} personas`} className="w-24 text-center font-serif text-[80px] leading-none text-carbon">
            {personas}
          </output>
          <BotonContador onClick={() => cambiar(1)} disabled={personas >= MAX} etiqueta="Agregar una persona">
            +
          </BotonContador>
        </div>
        <p className="text-center text-[15px] text-grafito">
          S/ {GARANTIA} por persona como adelanto de reserva · Mínimo {MIN} personas · Máximo {MAX} personas
        </p>
      </div>
      <AccionesPaso
        onContinuar={() => navigate('/reservar/fecha-hora')}
        ayuda={`Selecciona entre ${MIN} y ${MAX} personas. Los controles se desactivarán al alcanzar el mínimo o máximo permitido.`}
      />
    </CheckoutLayout>
  )
}
