import { ambientes } from './catalogos/ambientes.js'
import { metodosPago } from './catalogos/restaurante.js'
import { fechaHora } from '../compartido/fechas.js'
import { esperar, guardar, leer } from './bd.js'
import { disponibilidadAmbientes } from './disponibilidad.js'

function detalle(bd, reserva) {
  const pago = bd.pagos.find((p) => p.reservas_id === reserva.id && p.estado === 'aprobado')
  return {
    ...reserva,
    ambiente: ambientes.find((a) => a.id === reserva.ambientes_id),
    pago,
    metodoPago: metodosPago.find((m) => m.id === pago?.metodos_pago_id),
    comprobante: bd.comprobantes.find((c) => c.pagos_id === pago?.id),
  }
}

export function obtenerReserva(codigo, usuarioId) {
  const bd = leer()
  const reserva = bd.reservas.find((r) => r.codigo_reserva === codigo && r.usuarios_id === usuarioId)
  return reserva ? detalle(bd, reserva) : null
}

export function reservasDeUsuario(usuarioId) {
  const bd = leer()
  return bd.reservas
    .filter((r) => r.usuarios_id === usuarioId)
    .map((r) => detalle(bd, r))
    .sort((a, b) => fechaHora(a.fecha, a.hora) - fechaHora(b.fecha, b.hora))
}

export function esFutura(reserva) {
  return fechaHora(reserva.fecha, reserva.hora) > new Date()
}

// Porcentaje a devolver según la política de cancelación.
export function porcentajeReembolso(reserva) {
  const horas = (fechaHora(reserva.fecha, reserva.hora) - new Date()) / 36e5
  if (horas > 48) return 100
  if (horas >= 24) return 50
  return 0
}

export async function cancelarReserva(id, usuarioId) {
  await esperar()
  const bd = leer()
  const reserva = bd.reservas.find((r) => r.id === id && r.usuarios_id === usuarioId)
  if (!reserva || reserva.estado !== 'confirmada' || !esFutura(reserva)) {
    throw new Error('Esta reserva ya no se puede cancelar.')
  }
  const porcentaje = porcentajeReembolso(reserva)
  reserva.estado = 'cancelada'
  reserva.reembolso = { porcentaje, monto: (reserva.monto_garantia * porcentaje) / 100 }
  reserva.updated_at = new Date().toISOString()
  guardar(bd)
  return detalle(bd, reserva)
}

export async function reprogramarReserva(id, usuarioId, cambios) {
  await esperar()
  const bd = leer()
  const reserva = bd.reservas.find((r) => r.id === id && r.usuarios_id === usuarioId)
  if (!reserva || reserva.estado !== 'confirmada' || !esFutura(reserva)) {
    throw new Error('Esta reserva ya no se puede modificar.')
  }
  const disponible = disponibilidadAmbientes(cambios.fecha, cambios.hora, reserva.numero_comensales, reserva.id).find(
    (a) => a.ambiente.id === reserva.ambientes_id,
  )
  if (!disponible?.disponible) {
    throw new Error('Tu ambiente no tiene espacio en ese horario. Elige otra fecha u hora.')
  }
  Object.assign(reserva, {
    fecha: cambios.fecha,
    hora: cambios.hora,
    comentarios: cambios.comentarios.trim(),
    updated_at: new Date().toISOString(),
  })
  guardar(bd)
  return detalle(bd, reserva)
}
