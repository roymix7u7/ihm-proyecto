import { ambientes } from '../data/ambientes.js'
import {
  CODIGO_BILLETERA_RECHAZADO,
  horariosAtencion,
  metodosPago,
  parametros,
  TARJETA_RECHAZADA,
} from '../data/restaurante.js'
import { aTexto, deTexto, fechaHora, hoy, sumarDias } from '../utils/fechas.js'
import { soloDigitos } from '../utils/validaciones.js'

// API simulada: guarda las tablas del modelo de BD en localStorage y responde con
// un pequeño retraso para imitar una conexión real. Para conectar un backend de verdad,
// basta con reemplazar las funciones exportadas por llamadas fetch con la misma firma.

const CLAVE = 'ceniza-bd-v1'
const esperar = (ms = 600) => new Promise((resolver) => setTimeout(resolver, ms))

function semilla() {
  const fecha = aTexto(siguienteDiaAbierto(sumarDias(hoy(), 5)))
  return {
    usuarios: [
      {
        id: 1,
        nombre_completo: 'Carlos Alonso Mendoza Alvarez',
        dni: '72845196',
        correo: 'carlos.menalv@gmail.com',
        password: 'Ceniza2026',
        telefono: '982752941',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    reservas: [
      {
        id: 1,
        usuarios_id: 1,
        ambientes_id: 1,
        parametros_id: 1,
        fecha,
        hora: '20:30',
        numero_comensales: 2,
        comentarios: 'Celebramos nuestro aniversario.',
        precio_por_persona: parametros.garantia_por_persona,
        monto_garantia: 2 * parametros.garantia_por_persona,
        codigo_reserva: 'CEN-2026-0831',
        estado: 'confirmada',
        contacto: { nombre: 'Carlos Alonso Mendoza Alvarez', telefono: '982752941', correo: 'carlos.menalv@gmail.com' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    pagos: [
      {
        id: 1,
        reservas_id: 1,
        metodos_pago_id: 1,
        monto: 60,
        fecha_pago: new Date().toISOString(),
        transaccion_id: 'TX-SEMILLA-0001',
        estado: 'aprobado',
        tarjeta_ultimos4: '8824',
        motivo_rechazo: null,
      },
    ],
    comprobantes: [
      { id: 1, pagos_id: 1, numero: 'B001-00000831', enviado_correo: true, archivo_path: null, created_at: new Date().toISOString() },
    ],
    secuencia: 831,
  }
}

function leer() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado) return JSON.parse(guardado)
  } catch {
    // localStorage no disponible o corrupto: se usa la semilla.
  }
  const inicial = semilla()
  guardar(inicial)
  return inicial
}

function guardar(bd) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(bd))
  } catch {
    // Sin almacenamiento (modo privado): los cambios viven solo en memoria.
  }
}

function siguienteId(tabla) {
  return tabla.reduce((max, fila) => Math.max(max, fila.id), 0) + 1
}

function sinPassword(usuario) {
  if (!usuario) return null
  const { password: _omitido, ...resto } = usuario
  return resto
}

export function reiniciarDatosDemo() {
  guardar(semilla())
}

// --- Usuarios ---

export async function iniciarSesion(correo, password) {
  await esperar()
  const usuario = leer().usuarios.find((u) => u.correo.toLowerCase() === correo.trim().toLowerCase())
  if (!usuario || usuario.password !== password) {
    throw new Error('El correo o la contraseña no son correctos. Revisa tus datos e inténtalo de nuevo.')
  }
  return sinPassword(usuario)
}

export async function registrarUsuario(datos) {
  await esperar()
  const bd = leer()
  const correo = datos.correo.trim().toLowerCase()
  const errores = {}
  if (bd.usuarios.some((u) => u.correo.toLowerCase() === correo)) errores.correo = 'Ya existe una cuenta con este correo.'
  if (bd.usuarios.some((u) => u.dni === soloDigitos(datos.dni))) errores.dni = 'Ya existe una cuenta con este DNI.'
  if (Object.keys(errores).length) {
    const error = new Error('No pudimos crear tu cuenta. Revisa los campos marcados.')
    error.campos = errores
    throw error
  }
  const ahora = new Date().toISOString()
  const usuario = {
    id: siguienteId(bd.usuarios),
    nombre_completo: datos.nombre_completo.trim().replace(/\s+/g, ' '),
    dni: soloDigitos(datos.dni),
    correo,
    password: datos.password,
    telefono: soloDigitos(datos.telefono),
    created_at: ahora,
    updated_at: ahora,
  }
  bd.usuarios.push(usuario)
  guardar(bd)
  return sinPassword(usuario)
}

export function obtenerUsuario(id) {
  return sinPassword(leer().usuarios.find((u) => u.id === id))
}

export async function actualizarUsuario(id, datos) {
  await esperar()
  const bd = leer()
  const correo = datos.correo.trim().toLowerCase()
  if (bd.usuarios.some((u) => u.id !== id && u.correo.toLowerCase() === correo)) {
    const error = new Error('No pudimos guardar los cambios. Revisa los campos marcados.')
    error.campos = { correo: 'Este correo ya está registrado en otra cuenta.' }
    throw error
  }
  const usuario = bd.usuarios.find((u) => u.id === id)
  Object.assign(usuario, {
    nombre_completo: datos.nombre_completo.trim().replace(/\s+/g, ' '),
    correo,
    telefono: soloDigitos(datos.telefono),
    updated_at: new Date().toISOString(),
  })
  guardar(bd)
  return sinPassword(usuario)
}

export async function solicitarRecuperacion(correo) {
  await esperar(800)
  // Por seguridad, la respuesta es la misma exista o no la cuenta.
  return { correo: correo.trim().toLowerCase() }
}

// --- Disponibilidad (equivale a la tabla `disponibilidades`) ---

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

function siguienteDiaAbierto(fecha) {
  let dia = fecha
  while (dia.getDay() === 1) dia = sumarDias(dia, 1)
  return dia
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

// --- Reservas y pagos ---

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
