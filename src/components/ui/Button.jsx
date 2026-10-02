import { Link } from 'react-router'

const variantes = {
  oro: 'bg-oro text-white hover:bg-[#b08c48]',
  oscuro: 'bg-carbon text-crema hover:bg-black',
  'contorno-claro': 'border border-white text-white hover:bg-white hover:text-carbon',
  'contorno-oscuro': 'border border-carbon text-carbon hover:bg-carbon hover:text-crema',
}

// Botón base del sistema. Con `to` se renderiza como enlace de React Router.
// El padding va en `className` porque cada botón del diseño usa uno distinto.
export default function Button({ variante = 'oro', to, className = '', children, ...props }) {
  const clases = `inline-flex items-center justify-center gap-2.5 text-xs font-bold uppercase whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro ${variantes[variante]} ${className}`

  if (to) {
    return (
      <Link to={to} className={clases} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={clases} {...props}>
      {children}
    </button>
  )
}
