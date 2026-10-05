import { ambientes } from './catalogos/ambientes.js'
import { horariosAtencion, parametros } from './catalogos/restaurante.js'
import { aTexto, deTexto, hoy, sumarDias } from '../compartido/fechas.js'
import { leer } from './bd.js'

// Equivale a la tabla `disponibilidades` del modelo de BD.

// Número pseudoaleatorio estable a partir de un texto: la misma fecha y hora siempre
// dan la misma ocupación, así la simulación es coherente entre pantallas.
function hash(texto) {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

export function turnosDelDia(textoFecha) {
  const dia = deTexto(textoFecha).getDay()
  return horariosAtencion.filter((h) => h.es_activo && h.dia_semana === dia).flatMap((h) => h.turnos)
}

export function rangoFechas() {
  const minima = sumarDias(hoy(), 1)
  const maxima = sumarDias(hoy(), parametros.dias_anticipacion_maxima)
  return { minima, maxima }
}

export function estadoFecha(textoFecha) {
  const fecha = deTexto(textoFecha)
  const { minima, maxima } = rangoFechas()
  if (fecha < minima) return { disponible: false, motivo: 'Fecha pasada' }
  if (fecha > maxima) return { disponible: false, motivo: 'Fuera del rango de reservas' }
  if (turnosDelDia(textoFecha).length === 0) return { disponible: false, motivo: 'Cerrado los lunes' }
  if (hash(`cerrado-${textoFecha}`) < 0.06) return { disponible: false, motivo: 'Sin disponibilidad' }
  return { disponible: true }
}

function personasReservadas(bd, ambienteId, fecha, hora, excluirReservaId) {
  return bd.reservas
    .filter(
      (r) =>
        r.estado === 'confirmada' &&
        r.id !== excluirReservaId &&
        r.ambientes_id === ambienteId &&
        r.fecha === fecha &&
        r.hora === hora,
    )
    .reduce((total, r) => total + r.numero_comensales, 0)
}

// Ocupación simulada de otros clientes + reservas reales guardadas.
function ocupacion(bd, ambiente, fecha, hora, excluirReservaId) {
  const base = Math.floor(hash(`${fecha}-${hora}-${ambiente.id}`) * (ambiente.aforo_maximo + 4))
  return Math.min(ambiente.aforo_maximo, base) + personasReservadas(bd, ambiente.id, fecha, hora, excluirReservaId)
}

export function disponibilidadAmbientes(fecha, hora, personas, excluirReservaId) {
  const bd = leer()
  return ambientes.map((ambiente) => {
    if (personas > ambiente.aforo_maximo) {
      return { ambiente, disponible: false, motivo: `Este ambiente recibe hasta ${ambiente.aforo_maximo} personas.` }
    }
    const libres = ambiente.aforo_maximo - ocupacion(bd, ambiente, fecha, hora, excluirReservaId)
    if (libres < personas) {
      return {
        ambiente,
        disponible: false,
        motivo: 'No disponible por número de personas y/o fecha y hora seleccionados anteriormente.',
      }
    }
    return { ambiente, disponible: true }
  })
}

// Un horario está disponible si al menos un ambiente puede recibir al grupo.
export function horariosDisponibles(fecha, personas, excluirReservaId) {
  if (!estadoFecha(fecha).disponible) return []
  const esHoyMasUno = fecha === aTexto(sumarDias(hoy(), 1))
  return turnosDelDia(fecha).map((hora) => {
    const algunAmbiente = disponibilidadAmbientes(fecha, hora, personas, excluirReservaId).some((a) => a.disponible)
    const saturado = hash(`turno-${fecha}-${hora}`) < 0.18
    return { hora, disponible: algunAmbiente && !saturado && !(esHoyMasUno && hora === '13:00') }
  })
}

// Horarios en los que un ambiente concreto puede recibir al grupo (para reprogramar una reserva).
export function horariosParaAmbiente(fecha, personas, ambienteId, excluirReservaId) {
  if (!estadoFecha(fecha).disponible) return []
  return turnosDelDia(fecha).map((hora) => ({
    hora,
    disponible: disponibilidadAmbientes(fecha, hora, personas, excluirReservaId).some(
      (a) => a.ambiente.id === ambienteId && a.disponible,
    ),
  }))
}
