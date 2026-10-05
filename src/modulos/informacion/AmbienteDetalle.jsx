import { useParams } from 'react-router'
import Breadcrumb from '../../compartido/ui/Breadcrumb.jsx'
import Button from '../../compartido/ui/Button.jsx'
import Eyebrow from '../../compartido/ui/Eyebrow.jsx'
import { buscarAmbiente } from '../../datos/catalogos/ambientes.js'
import Proximamente from '../../compartido/layout/Proximamente.jsx'

export default function AmbienteDetalle() {
  const { slug } = useParams()
  const ambiente = buscarAmbiente(slug)

  if (!ambiente) {
    return <Proximamente titulo="Este ambiente no existe" etiqueta="Ambiente no encontrado" />
  }

  const [principal, ...laterales] = ambiente.imagenes
  const nombreCorto = ambiente.nombre.replace(/^El /, '')

  return (
    <>
      <section className="flex flex-col gap-4 px-5 pt-4 md:px-10 lg:h-[520px] lg:flex-row lg:px-20">
        <img
          src={principal}
          alt={`Vista principal de ${ambiente.nombre}`}
          className="h-64 w-full object-cover sm:h-80 lg:h-full lg:flex-1"
        />
        <div className="grid grid-cols-2 gap-4 lg:flex lg:w-[400px] lg:shrink-0 lg:flex-col">
          {laterales.map((imagen, i) => (
            <img
              key={imagen}
              src={imagen}
              alt={`${ambiente.nombre}, vista ${i + 2}`}
              className={`h-36 w-full object-cover sm:h-48 lg:h-auto lg:min-h-0 lg:flex-1 ${laterales.length === 1 ? 'col-span-2' : ''}`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-10 px-5 py-12 md:px-10 lg:p-20">
        <div className="flex flex-col gap-4">
          <Breadcrumb
            items={[{ label: 'Inicio', to: '/' }, { label: 'Ambientes', to: '/ambientes' }, { label: nombreCorto }]}
          />
          <h1 className="font-serif text-5xl text-carbon lg:text-[56px]">{ambiente.nombre}</h1>
        </div>
        <p className="text-base leading-[1.8] text-grafito">{ambiente.descripcion_detalle}</p>
        <div className="flex flex-wrap gap-4">
          <Button
            to={`/reservar?ambiente=${ambiente.slug}`}
            variante="oscuro"
            className="rounded px-6 py-3.5 font-semibold"
          >
            Realizar reserva
          </Button>
          <Button to="/ambientes" variante="contorno-oscuro" className="rounded px-6 py-3.5 font-semibold">
            Volver a ambientes
          </Button>
        </div>
        <div className="flex flex-col gap-6 pt-3">
          <Eyebrow className="text-xs">Características del espacio</Eyebrow>
          <dl className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
            {ambiente.caracteristicas.map((caracteristica) => (
              <div key={caracteristica.tipo} className="flex flex-col gap-1">
                <dt className="text-[11px] font-bold uppercase text-carbon">{caracteristica.tipo}</dt>
                <dd className="text-sm text-grafito">{caracteristica.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {ambiente.momentos.length > 0 && (
        <section className="flex flex-col gap-8 px-5 pb-16 md:px-10 lg:px-20 lg:pb-[100px]">
          <h2 className="font-serif text-[28px] text-carbon lg:text-[32px]">
            Así se vive este espacio en tus momentos especiales
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {ambiente.momentos.map((imagen, i) => (
              <img
                key={imagen}
                src={imagen}
                alt={`Momento especial ${i + 1} en ${ambiente.nombre}`}
                loading="lazy"
                className="h-[300px] w-full object-cover"
              />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
