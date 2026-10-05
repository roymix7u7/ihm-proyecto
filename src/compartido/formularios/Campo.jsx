import { CircleAlert } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export const claseEntrada =
  'w-full rounded border border-linea bg-white p-4 text-sm text-carbon placeholder:text-grafito/60 transition-colors focus:border-oro focus:outline-none focus:ring-2 focus:ring-oro/30 aria-[invalid=true]:border-error aria-[invalid=true]:focus:ring-error/20 disabled:bg-crema disabled:text-grafito'

// Envoltura de un campo de formulario: etiqueta, control, ayuda y mensaje de error.
export default function Campo({ id, etiqueta, obligatorio, opcional, ayuda, error, className = '', children }) {
  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-bold uppercase text-carbon">
        {etiqueta}
        {obligatorio && (
          <span className="text-[11px] text-oro" aria-hidden="true">
            *
          </span>
        )}
        {opcional && <span className="font-light normal-case">(opcional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-xs text-error" role="alert">
          <CircleAlert size={14} className="mt-px shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        ayuda && <p className="text-[11px] text-grafito">{ayuda}</p>
      )}
    </div>
  )
}
