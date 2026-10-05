import { Fragment } from 'react'
import Breadcrumb from '../../compartido/ui/Breadcrumb.jsx'
import Eyebrow from '../../compartido/ui/Eyebrow.jsx'
import { categoriasMenu, etiquetas, platos, temporadaActiva } from '../../datos/catalogos/platos.js'

export default function Menu() {
  const categorias = [...categoriasMenu]
    .sort((a, b) => a.position - b.position)
    .map((categoria) => ({
      ...categoria,
      platos: platos.filter(
        (plato) =>
          plato.is_active && plato.categorias_menu_id === categoria.id && plato.temporadas_menu_id === temporadaActiva.id,
      ),
    }))
    .filter((categoria) => categoria.platos.length > 0)

  return (
    <>
      <section className="flex flex-col items-center gap-5 px-5 pt-12 pb-10 text-center md:px-10 lg:px-20 lg:pt-16">
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Menú' }]} />
        <h1 className="font-serif text-5xl text-carbon lg:text-[64px]">Nuestro Menú de Estación</h1>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase text-oro">Menú referencial</p>
          <p className="text-sm leading-normal text-grafito">
            Esta carta es referencial. Los platos y su disponibilidad pueden variar según temporada y propuesta del chef.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-16 border-y border-linea bg-white px-5 py-16 md:px-10 lg:px-[130px] lg:py-20">
        <div className="flex flex-col items-center gap-3">
          <Eyebrow className="text-[10px]">{temporadaActiva.nombre}</Eyebrow>
          <span className="h-[1.5px] w-[60px] bg-oro" aria-hidden="true" />
        </div>

        {categorias.map((categoria) => (
          <div key={categoria.id} className="flex flex-col gap-8">
            <h2 className="text-center text-[13px] font-bold uppercase text-oro">{categoria.nombre}</h2>
            <ul className="flex flex-col gap-6">
              {categoria.platos.map((plato, i) => (
                <Fragment key={plato.id}>
                  {i > 0 && <li aria-hidden="true" className="border-t border-linea" />}
                  <li className="flex items-center gap-5 sm:gap-10">
                    <img
                      src={plato.imagen_path}
                      alt={plato.nombre}
                      loading="lazy"
                      className="h-[72px] w-24 shrink-0 object-cover sm:h-[100px] sm:w-[140px]"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="font-serif text-xl text-carbon sm:text-[22px]">{plato.nombre}</h3>
                      <p className="text-[13px] leading-normal text-grafito">{plato.descripcion}</p>
                      <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-1" aria-label="Etiquetas">
                        {plato.etiquetas.map((clave) => (
                          <li
                            key={clave}
                            className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase ${etiquetas[clave].clase}`}
                          >
                            {etiquetas[clave].label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex flex-col items-center gap-3 pt-5 text-center text-[13px] text-grafito">
          <p>Nuestra propuesta culinaria cambia de acuerdo a la generosidad de la tierra en cada micro-estación.</p>
          <p>
            Información referencial de alérgenos y preferencias alimentarias. Consulte al personal ante alergias o
            restricciones específicas.
          </p>
          <p className="text-[11px] font-semibold uppercase text-oro">
            Ceniza Alta Cocina • Chef Ejecutivo: Ignacio Varas
          </p>
        </div>
      </section>
    </>
  )
}
