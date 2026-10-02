// Casilla de verificación con el estilo del sistema.
export default function Casilla({ id, checked, onChange, children }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-grafito select-none">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 cursor-pointer rounded border-linea accent-oro"
      />
      {children}
    </label>
  )
}
