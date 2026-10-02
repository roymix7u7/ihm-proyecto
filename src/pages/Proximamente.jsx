import Button from '../components/ui/Button.jsx'
import Eyebrow from '../components/ui/Eyebrow.jsx'

// Página temporal para las rutas cuyas pantallas aún no se implementan.
export default function Proximamente({ titulo }) {
  return (
    <section className="flex flex-col items-center gap-6 px-5 py-32 text-center">
      <Eyebrow>En construcción</Eyebrow>
      <h1 className="font-serif text-5xl text-carbon">{titulo}</h1>
      <Button to="/" variante="contorno-oscuro" className="px-10 py-4">
        Volver al inicio
      </Button>
    </section>
  )
}
