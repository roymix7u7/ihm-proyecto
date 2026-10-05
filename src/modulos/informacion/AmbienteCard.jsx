import { Link } from 'react-router'
import Eyebrow from '../../compartido/ui/Eyebrow.jsx'

// Tarjeta vertical de ambiente usada en la grilla del Home.
export default function AmbienteCard({ ambiente }) {
  return (
    <article className="group flex flex-col gap-6">
      <Link to={`/ambientes/${ambiente.slug}`} className="block overflow-hidden">
        <img
          src={ambiente.imagen_portada}
          alt={`Ambiente ${ambiente.nombre}`}
          loading="lazy"
          className="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-105 lg:h-[400px]"
        />
      </Link>
      <div className="flex flex-col gap-2">
        <Eyebrow>{ambiente.categoria}</Eyebrow>
        <h3 className="font-serif text-[32px] leading-tight text-carbon">
          <Link to={`/ambientes/${ambiente.slug}`} className="hover:text-oro">
            {ambiente.nombre}
          </Link>
        </h3>
        <p className="text-sm leading-[1.6] text-grafito">{ambiente.resumen}</p>
      </div>
    </article>
  )
}
