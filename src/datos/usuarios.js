import { soloDigitos } from '../compartido/formularios/validaciones.js'
import { esperar, guardar, leer, siguienteId } from './bd.js'

function sinPassword(usuario) {
  if (!usuario) return null
  const { password: _omitido, ...resto } = usuario
  return resto
}

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
