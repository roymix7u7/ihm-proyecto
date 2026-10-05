// Sobretítulo dorado en mayúsculas que acompaña a los títulos de sección.
export default function Eyebrow({ className = 'text-[11px]', children }) {
  return <p className={`font-bold uppercase text-oro ${className}`}>{children}</p>
}
