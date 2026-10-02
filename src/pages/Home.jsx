import iconoFlecha from '../assets/icons/arrow-right.svg'
import imgFilosofia from '../assets/home/filosofia.png'
import imgHero from '../assets/home/hero.png'
import AmbienteCard from '../components/ambientes/AmbienteCard.jsx'
import Button from '../components/ui/Button.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'
import { ambientes } from '../data/ambientes.js'
import { platos, platosDestacadosIds } from '../data/platos.js'

const pilares = [
  'Ingredientes nativos recolectados a mano',
  'Curaduría de maderas de origen sostenible',
  'Técnicas milenarias combinadas con maestría contemporánea',
]

const contenedor = 'px-5 md:px-10 lg:px-20'
const divisor = 'mx-5 border-linea md:mx-10 lg:mx-20'

export default function Home() {
  const destacados = platos.filter((plato) => platosDestacadosIds.includes(plato.id))

  return (
    <>
      <section className={`relative flex min-h-[560px] flex-col justify-end gap-8 py-16 lg:h-[680px] lg:p-20 ${contenedor}`}>
        <img src={imgHero} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-carbon/50" />

        <div className="relative flex max-w-[800px] flex-col gap-5">
          <Eyebrow className="text-xs">Sabores de Humo, Fuego y Memoria</Eyebrow>
          <h1 className="font-serif text-5xl leading-[0.95] text-white md:text-[64px] lg:text-[80px]">
            Descubra el origen de la alta cocina ancestral
          </h1>
        </div>
        <div className="relative flex flex-wrap gap-5">
          <Button to="/reservar" variante="oro" className="px-8 py-[18px]">
            Reservar una mesa
            <img src={iconoFlecha} alt="" width="12" height="12" />
          </Button>
          <Button to="/ambientes" variante="contorno-claro" className="px-8 py-[18px]">
            Ver ambientes
          </Button>
        </div>
      </section>

      <section className={`flex flex-col gap-12 py-16 lg:py-[100px] ${contenedor}`}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex max-w-[500px] flex-col gap-3">
            <Eyebrow>La Arquitectura de la Mesa</Eyebrow>
            <h2 className="font-serif text-4xl text-carbon lg:text-5xl">Tres atmósferas, un mismo relato</h2>
          </div>
          <p className="max-w-[400px] text-[15px] leading-normal text-grafito">
            Cada rincón de Ceniza está diseñado para transformar el acto de comer en un ritual íntimo y sublime.
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {ambientes.map((ambiente) => (
            <AmbienteCard key={ambiente.id} ambiente={ambiente} />
          ))}
        </div>
      </section>

      <hr className={divisor} />

      <section className={`flex flex-col items-center gap-12 py-16 lg:flex-row lg:gap-20 lg:py-[120px] ${contenedor}`}>
        <img
          src={imgFilosofia}
          alt="Chef emplatando con pinzas un plato sobre carbón"
          loading="lazy"
          className="aspect-[580/680] w-full max-w-[580px] shrink-0 object-cover lg:h-[680px] lg:w-[580px]"
        />
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Eyebrow className="text-xs">La Filosofía de la Ceniza</Eyebrow>
            <h2 className="font-serif text-4xl leading-[1.05] text-carbon lg:text-[56px]">
              Transformar el fuego en un lenguaje absoluto
            </h2>
          </div>
          <p className="text-base leading-[1.8] text-grafito">
            En Ceniza, creemos que el humo no es solo un método de cocción, sino un ingrediente vivo, volátil y evocador.
            Estudiamos las distintas maderas autóctonas (algarrobo, manzano, encino) para perfumar cada insumo en su
            punto de máxima sutileza.
          </p>
          <ul className="flex flex-col gap-4">
            {pilares.map((pilar) => (
              <li key={pilar} className="flex items-center gap-4 text-sm font-semibold text-carbon">
                <span className="h-px w-5 shrink-0 bg-oro" aria-hidden="true" />
                {pilar}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr className={divisor} />

      <section className={`flex flex-col gap-16 py-16 lg:py-[100px] ${contenedor}`}>
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow>El Menú Informativo</Eyebrow>
          <h2 className="font-serif text-4xl text-carbon lg:text-5xl">Destacados de Nuestra Carta</h2>
        </div>
        <ul className="grid gap-x-16 gap-y-10 md:grid-cols-2">
          {destacados.map((plato) => (
            <li key={plato.id} className="flex flex-col gap-2">
              <h3 className="font-serif text-2xl text-carbon">{plato.nombre}</h3>
              <p className="text-sm leading-normal text-grafito">{plato.descripcion}</p>
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <Button to="/menu" variante="contorno-oscuro" className="px-10 py-4">
            Ver menú completo
          </Button>
        </div>
      </section>
    </>
  )
}
