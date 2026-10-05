import { CODIGO_BILLETERA_RECHAZADO, metodosPago, parametros, TARJETA_RECHAZADA } from './catalogos/restaurante.js'
import { soloDigitos } from '../compartido/formularios/validaciones.js'
import { esperar, guardar, leer, siguienteId } from './bd.js'
import { disponibilidadAmbientes } from './disponibilidad.js'

function nuevoCodigo(bd) {
  bd.secuencia += 1
  return `CEN-${new Date().getFullYear()}-${String(bd.secuencia).padStart(4, '0')}`
}

function motivoRechazo(metodo, datosPago) {
  if (metodo === 'tarjeta' && soloDigitos(datosPago.numero) === TARJETA_RECHAZADA) {
    return 'La entidad emisora rechazó la transacción.'
  }
  if (metodo !== 'tarjeta' && soloDigitos(datosPago.codigo) === CODIGO_BILLETERA_RECHAZADO) {
    return 'El código de aprobación expiró o no es válido.'
  }
  return null
}

// Procesa el pago de la garantía. Si se aprueba, crea la reserva confirmada, el pago y el comprobante.
export async function pagarReserva(borrador, usuario, metodo, datosPago) {
  await esperar(2500)
  const bd = leer()
  const disponible = disponibilidadAmbientes(borrador.fecha, borrador.hora, borrador.personas).find(
    (a) => a.ambiente.id === borrador.ambienteId,
  )
  if (!disponible?.disponible) {
    const error = new Error('El ambiente dejó de estar disponible para ese horario. Elige otro ambiente u horario.')
    error.tipo = 'disponibilidad'
    throw error
  }

  const metodoPago = metodosPago.find((m) => m.clave === metodo)
  const monto = borrador.personas * parametros.garantia_por_persona
  const rechazo = motivoRechazo(metodo, datosPago)
  const ahora = new Date().toISOString()

  if (rechazo) {
    bd.pagos.push({
      id: siguienteId(bd.pagos),
      reservas_id: null,
      metodos_pago_id: metodoPago.id,
      monto,
      fecha_pago: ahora,
      transaccion_id: `TX-${Date.now()}`,
      estado: 'rechazado',
      tarjeta_ultimos4: metodo === 'tarjeta' ? soloDigitos(datosPago.numero).slice(-4) : null,
      motivo_rechazo: rechazo,
    })
    guardar(bd)
    const error = new Error(rechazo)
    error.tipo = 'rechazo'
    throw error
  }

  const reserva = {
    id: siguienteId(bd.reservas),
    usuarios_id: usuario.id,
    ambientes_id: borrador.ambienteId,
    parametros_id: 1,
    fecha: borrador.fecha,
    hora: borrador.hora,
    numero_comensales: borrador.personas,
    comentarios: borrador.datos.comentarios.trim(),
    precio_por_persona: parametros.garantia_por_persona,
    monto_garantia: monto,
    codigo_reserva: nuevoCodigo(bd),
    estado: 'confirmada',
    contacto: {
      nombre: borrador.datos.nombre.trim(),
      telefono: soloDigitos(borrador.datos.telefono),
      correo: borrador.datos.correo.trim().toLowerCase(),
    },
    created_at: ahora,
    updated_at: ahora,
  }
  const pago = {
    id: siguienteId(bd.pagos),
    reservas_id: reserva.id,
    metodos_pago_id: metodoPago.id,
    monto,
    fecha_pago: ahora,
    transaccion_id: `TX-${Date.now()}`,
    estado: 'aprobado',
    tarjeta_ultimos4: metodo === 'tarjeta' ? soloDigitos(datosPago.numero).slice(-4) : null,
    motivo_rechazo: null,
  }
  bd.reservas.push(reserva)
  bd.pagos.push(pago)
  bd.comprobantes.push({
    id: siguienteId(bd.comprobantes),
    pagos_id: pago.id,
    numero: `B001-${String(bd.secuencia).padStart(8, '0')}`,
    enviado_correo: true,
    archivo_path: null,
    created_at: ahora,
  })
  guardar(bd)
  return reserva
}
