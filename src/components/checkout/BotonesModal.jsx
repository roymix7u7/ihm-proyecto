// Par de botones de los modales del diseño: "volver" (gris arena) y la acción principal (dorado).
export default function BotonesModal({ textoVolver, onVolver, textoConfirmar, onConfirmar, cargando = false }) {
  return (
    <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center sm:gap-5">
      <button
        type="button"
        onClick={onVolver}
        disabled={cargando}
        className="rounded bg-linea px-8 py-4 text-[13px] font-bold uppercase text-grafito transition-colors hover:bg-[#e0d9cd] disabled:opacity-50"
      >
        {textoVolver}
      </button>
      <button
        type="button"
        onClick={onConfirmar}
        disabled={cargando}
        className="rounded bg-oro px-8 py-4 text-[13px] font-bold uppercase text-grafito transition-colors hover:bg-[#b08c48] disabled:opacity-60"
      >
        {cargando ? 'Procesando…' : textoConfirmar}
      </button>
    </div>
  )
}
