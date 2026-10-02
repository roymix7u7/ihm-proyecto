import { Fragment } from 'react'
import iconoFlecha from '../assets/icons/arrow-right.svg'
import Breadcrumb from '../components/ui/Breadcrumb.jsx'
import Button from '../components/ui/Button.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import { ambientes } from '../data/ambientes.js'

function Dato({ etiqueta, children }) {
  return (
    <div className="flex flex-col gap-1">
      <Eyebrow>{etiqueta}</Eyebrow>
      {children}
    </div>
  )
}

export default function Ambientes() {
  return (
    <>
      <section className="flex flex-col gap-5 px-5 pt-12 pb-10 md:px-10 lg:px-20 lg:pt-16">
        <Breadcrumb items={[{ label: 'Inicio', to: '/' }, { label: 'Nuestros Ambientes' }]} />
        <h1 className="font-serif text-5xl text-carbon lg:text-[64px]">Nuestros Ambientes</h1>
      </section>

      <section className="flex flex-col gap-12 px-5 pb-16 md:px-10 lg:gap-20 lg:px-20 lg:pb-[100px]">
        {ambientes.map((ambiente, i) => (
          <Fragment key={ambiente.id}>
            {i > 0 && <hr className="border-linea" />}
            <article className={`flex flex-col gap-8 lg:items-center lg:gap-16 ${i % 2 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
              <img
                src={ambiente.imagen_web}
                alt={`Ambiente ${ambiente.nombre}`}
                loading={i ? 'lazy' : 'eager'}
                className="aspect-[640/420] w-full shrink-0 object-cover lg:h-[420px] lg:w-[640px]"
              />
              <div className="flex flex-1 flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Eyebrow>Ambiente {i + 1}</Eyebrow>
                  <h2 className="font-serif text-4xl text-carbon lg:text-[44px]">{ambiente.nombre}</h2>
                </div>
                <p className="text-[15px] leading-[1.7] text-grafito">{ambiente.descripcion}</p>
                <div className="flex flex-wrap gap-x-10 gap-y-4 xl:flex-nowrap">
                  <Dato etiqueta="Atmósfera">
                    <p className="text-sm text-carbon">{ambiente.atmosfera}</p>
                  </Dato>
                  <Dato etiqueta="Tipo de espacio">
                    <p className="text-sm text-carbon">{ambiente.tipo_espacio}</p>
                  </Dato>
                  <Dato etiqueta="Capacidad">
                    <p className="text-sm text-carbon">Máximo {ambiente.aforo_maximo} personas</p>
                    <p className="max-w-[212px] text-[13px] font-extralight text-carbon">
                      Sujeto a disponibilidad según fecha y horario*
                    </p>
                  </Dato>
                </div>
                <div className="flex flex-wrap gap-4 pt-3">
                  <Button to={`/reservar?ambiente=${ambiente.slug}`} className="gap-2 px-6 py-3.5 text-[11px]">
                    Reservar mesa
                    <img src={iconoFlecha} alt="" width="10" height="10" />
                  </Button>
                  <Button to={`/ambientes/${ambiente.slug}`} variante="contorno-oscuro" className="px-6 py-3.5 text-[11px]">
                    Ver detalles
                  </Button>
                </div>
              </div>
            </article>
          </Fragment>
        ))}
      </section>
    </>
  )
}
