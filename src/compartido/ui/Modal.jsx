import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'

// Diálogo modal accesible: bloquea el fondo, enfoca su contenido y se cierra con Esc
// (salvo que `bloqueado` sea true, por ejemplo mientras se procesa un pago).
export default function Modal({ abierto, onCerrar, titulo, icono, bloqueado = false, className = '', children }) {
  const idTitulo = useId()
  const caja = useRef(null)
  const cerrar = useRef(onCerrar)

  useEffect(() => {
    cerrar.current = onCerrar
  })

  useEffect(() => {
    if (!abierto) return
    const anterior = document.activeElement
    const desplazamiento = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    caja.current?.focus()

    function alPresionar(e) {
      if (e.key === 'Escape' && !bloqueado) cerrar.current?.()
      if (e.key !== 'Tab' || !caja.current) return
      // Mantiene el foco dentro del modal.
      const enfocables = caja.current.querySelectorAll('button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])')
      if (!enfocables.length) return
      const primero = enfocables[0]
      const ultimo = enfocables[enfocables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener('keydown', alPresionar)
    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.style.overflow = desplazamiento
      anterior?.focus?.()
    }
  }, [abierto, bloqueado])

  if (!abierto) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-carbon/50 p-5"
      onMouseDown={(e) => e.target === e.currentTarget && !bloqueado && onCerrar?.()}
    >
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        className={twMerge(
          'my-auto flex w-full max-w-[480px] flex-col items-center gap-6 rounded-xl bg-white p-8 shadow-[0_16px_20px_rgba(21,21,21,0.13)] outline-none sm:p-12',
          className,
        )}
      >
        {icono}
        <h2 id={idTitulo} className="text-center font-serif text-[28px] leading-tight text-carbon sm:text-[32px]">
          {titulo}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}
