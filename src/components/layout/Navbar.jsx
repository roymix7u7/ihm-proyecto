import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import iconoCuenta from '../../assets/icons/account-circle.svg'
import Button from '../ui/Button.jsx'

const enlaces = [
  { to: '/', label: 'Inicio' },
  { to: '/ambientes', label: 'Ambientes' },
  { to: '/menu', label: 'Menú' },
  { to: '/reservar', label: 'Reservar' },
  { to: '/mi-reserva', label: 'Mi Reserva' },
]

function claseEnlace({ isActive }) {
  return `relative text-base transition-colors hover:text-carbon ${
    isActive
      ? 'font-semibold text-carbon after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-10 after:bg-oro'
      : 'text-grafito'
  }`
}

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="sticky top-0 z-50 border-b border-linea bg-crema">
      <div className="flex h-[90px] items-center justify-between px-5 md:px-10 xl:px-20">
        <Link to="/" onClick={cerrarMenu} className="flex flex-col gap-0.5 whitespace-nowrap">
          <span className="font-serif text-[28px] leading-none text-carbon">CENIZA</span>
          <span className="text-[9px] font-semibold uppercase text-oro">Alta Cocina</span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {enlaces.map((enlace) => (
              <li key={enlace.to}>
                <NavLink to={enlace.to} end={enlace.to === '/'} className={claseEnlace}>
                  {enlace.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 lg:gap-[30px]">
          <Button
            to="/reservar"
            variante="oscuro"
            className="rounded px-5 py-2.5 text-[11px] font-semibold max-sm:hidden"
          >
            Reservar mesa privada
          </Button>
          <Link to="/login" aria-label="Mi cuenta" className="shrink-0">
            <img src={iconoCuenta} alt="" width="40" height="40" className="size-10" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            className="flex size-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span className={`h-0.5 w-6 bg-carbon transition-transform ${menuAbierto ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-carbon transition-opacity ${menuAbierto ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-carbon transition-transform ${menuAbierto ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {menuAbierto && (
        <nav id="menu-movil" aria-label="Principal" className="border-t border-linea px-5 pb-6 md:px-10 lg:hidden">
          <ul className="flex flex-col">
            {enlaces.map((enlace) => (
              <li key={enlace.to} className="border-b border-linea">
                <NavLink
                  to={enlace.to}
                  end={enlace.to === '/'}
                  onClick={cerrarMenu}
                  className={({ isActive }) =>
                    `block py-4 text-base ${isActive ? 'font-semibold text-carbon' : 'text-grafito'}`
                  }
                >
                  {enlace.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Button
            to="/reservar"
            variante="oscuro"
            onClick={cerrarMenu}
            className="mt-6 w-full rounded px-5 py-3 text-[11px] font-semibold sm:hidden"
          >
            Reservar mesa privada
          </Button>
        </nav>
      )}
    </header>
  )
}
