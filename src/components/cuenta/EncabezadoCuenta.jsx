import Eyebrow from '../ui/Eyebrow.jsx'

// Encabezado centrado de las pantallas de cuenta (login, registro, perfil).
export default function EncabezadoCuenta({ seccion = 'Mi cuenta', estado, titulo, descripcion }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Eyebrow>{seccion}</Eyebrow>
        {estado && (
          <span className="flex items-center gap-1.5 rounded-full border border-linea bg-white px-2.5 py-1 text-[11px] font-semibold text-grafito">
            <span className="size-2 rounded-full bg-exito" aria-hidden="true" />
            {estado}
          </span>
        )}
      </div>
      <h1 className="font-serif text-4xl text-carbon sm:text-5xl">{titulo}</h1>
      {descripcion && <p className="text-sm text-grafito sm:text-base">{descripcion}</p>}
    </div>
  )
}
