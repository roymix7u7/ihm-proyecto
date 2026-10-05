// Las fechas de reserva se guardan como texto 'AAAA-MM-DD' y se interpretan en hora local.

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export function aTexto(fecha) {
  const m = String(fecha.getMonth() + 1).padStart(2, '0')
  const d = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${m}-${d}`
}

export function deTexto(texto) {
  const [a, m, d] = texto.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export function hoy() {
  const ahora = new Date()
  return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
}

export function sumarDias(fecha, dias) {
  const nueva = new Date(fecha)
  nueva.setDate(nueva.getDate() + dias)
  return nueva
}

// Momento exacto de una reserva (fecha + hora) para calcular plazos.
export function fechaHora(texto, hora) {
  const [h, min] = hora.split(':').map(Number)
  const fecha = deTexto(texto)
  fecha.setHours(h, min)
  return fecha
}

export function nombreMes(indice) {
  return MESES[indice]
}

// "Jueves, 15 Oct del 2026"
export function fechaCorta(texto) {
  const f = deTexto(texto)
  return `${DIAS[f.getDay()]}, ${f.getDate()} ${MESES[f.getMonth()].slice(0, 3)} del ${f.getFullYear()}`
}

// "Jueves 15 de Octubre del 2026"
export function fechaLarga(texto) {
  const f = deTexto(texto)
  return `${DIAS[f.getDay()]} ${f.getDate()} de ${MESES[f.getMonth()]} del ${f.getFullYear()}`
}

// "Jueves, 15 de Octubre del 2026"
export function fechaLargaConComa(texto) {
  const f = deTexto(texto)
  return `${DIAS[f.getDay()]}, ${f.getDate()} de ${MESES[f.getMonth()]} del ${f.getFullYear()}`
}

export function soles(monto) {
  return `S/ ${monto.toFixed(2)}`
}

export function personasTexto(n) {
  return `${n} ${n === 1 ? 'persona' : 'personas'}`
}
