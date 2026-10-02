import { Fragment } from 'react'
import { Link } from 'react-router'
import iconoChevron from '../../assets/icons/chevron-right.svg'

// Migas de pan: el último elemento es la página actual (en dorado, sin enlace).
export default function Breadcrumb({ items, className = '' }) {
  return (
    <nav aria-label="Ruta de navegación" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase">
        {items.map((item, i) => {
          const esUltimo = i === items.length - 1
          return (
            <Fragment key={item.label}>
              <li>
                {esUltimo ? (
                  <span aria-current="page" className="text-oro">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.to} className="text-grafito hover:text-carbon">
                    {item.label}
                  </Link>
                )}
              </li>
              {!esUltimo && (
                <li aria-hidden="true">
                  <img src={iconoChevron} alt="" width="10" height="10" />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
