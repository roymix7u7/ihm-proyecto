import { CircleCheck, TriangleAlert } from 'lucide-react'

// Mensaje general del formulario (error o éxito) que se anuncia a lectores de pantalla.
export default function AvisoValidacion({ tipo = 'error', children }) {
  if (!children) return null
  const esError = tipo === 'error'
  const Icono = esError ? TriangleAlert : CircleCheck
  return (
    <div
      role={esError ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded border p-3.5 text-sm ${
        esError ? 'border-error bg-error-suave text-error' : 'border-exito bg-exito-suave text-exito'
      }`}
    >
      <Icono size={18} className="mt-px shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}
