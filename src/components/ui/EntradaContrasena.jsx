import { Eye, EyeOff } from 'lucide-react'
import { claseEntrada } from './Campo.jsx'

// Campo de contraseña con botón de "ojo" para mostrar u ocultar el texto.
export default function EntradaContrasena({ visible, onAlternar, ...props }) {
  return (
    <div className="relative">
      <input type={visible ? 'text' : 'password'} className={`${claseEntrada} pr-12`} {...props} />
      <button
        type="button"
        onClick={onAlternar}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        aria-pressed={visible}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-grafito hover:text-carbon focus-visible:outline-2 focus-visible:outline-oro"
      >
        {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  )
}
