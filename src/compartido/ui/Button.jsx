import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'

const variantes = {
  oro: 'bg-oro text-white hover:bg-[#b08c48]',
  oscuro: 'bg-carbon text-crema hover:bg-black',
  'contorno-claro': 'border border-white text-white hover:bg-white hover:text-carbon',
  'contorno-oscuro': 'border border-carbon text-carbon hover:bg-carbon hover:text-crema',
  salir: 'bg-salir text-white hover:bg-[#f26b6d]',
}

// Botón base del sistema. Con `to` se renderiza como enlace de React Router.
// El padding va en `className` porque cada botón del diseño usa uno distinto;
// twMerge hace que las clases de `className` reemplacen a las base cuando chocan.
export default function Button({ variante = 'oro', to, type = 'button', className = '', children, ...props }) {
  const clases = twMerge(
    'inline-flex items-center justify-center gap-2.5 text-xs font-bold uppercase whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro disabled:cursor-not-allowed disabled:opacity-50',
    variantes[variante],
    className,
  )

  if (to) {
    return (
      <Link to={to} className={clases} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={clases} {...props}>
      {children}
    </button>
  )
}
