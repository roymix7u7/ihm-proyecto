import { parametros } from './catalogos/restaurante.js'
import { aTexto, hoy, sumarDias } from '../compartido/fechas.js'

// API simulada: guarda las tablas del modelo de BD en localStorage y responde con
// un pequeño retraso para imitar una conexión real. Para conectar un backend de verdad,
// basta con reemplazar las funciones exportadas por llamadas fetch con la misma firma.

const CLAVE = 'ceniza-bd-v1'
export const esperar = (ms = 600) => new Promise((resolver) => setTimeout(resolver, ms))

function siguienteDiaAbierto(fecha) {
  let dia = fecha
  while (dia.getDay() === 1) dia = sumarDias(dia, 1)
  return dia
}

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

export function leer() {
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

export function guardar(bd) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(bd))
  } catch {
    // Sin almacenamiento (modo privado): los cambios viven solo en memoria.
  }
}

export function siguienteId(tabla) {
  return tabla.reduce((max, fila) => Math.max(max, fila.id), 0) + 1
}

export function reiniciarDatosDemo() {
  guardar(semilla())
}
