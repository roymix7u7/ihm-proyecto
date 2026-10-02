// Cada validador recibe el valor y devuelve un mensaje de error o '' si es válido.

export const soloDigitos = (valor) => valor.replace(/\D/g, '')

export function nombreCompleto(valor) {
  const limpio = valor.trim()
  if (!limpio) return 'Ingresa tu nombre completo.'
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/.test(limpio)) return 'Usa solo letras y espacios.'
  if (limpio.split(/\s+/).length < 2) return 'Ingresa al menos un nombre y un apellido.'
  if (limpio.length > 80) return 'El nombre no puede superar los 80 caracteres.'
  return ''
}

export function correo(valor) {
  const limpio = valor.trim()
  if (!limpio) return 'Ingresa tu correo electrónico.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(limpio)) return 'Ingresa un correo válido, por ejemplo nombre@correo.com.'
  return ''
}

export function telefono(valor) {
  const digitos = soloDigitos(valor)
  if (!digitos) return 'Ingresa tu número de celular.'
  if (digitos.length !== 9 || !digitos.startsWith('9')) return 'El celular debe tener 9 dígitos y empezar con 9.'
  return ''
}

export function dni(valor) {
  const digitos = soloDigitos(valor)
  if (!digitos) return 'Ingresa tu DNI.'
  if (digitos.length !== 8) return 'El DNI debe tener 8 dígitos.'
  return ''
}

export function contrasena(valor) {
  if (!valor) return 'Ingresa una contraseña.'
  if (valor.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (!/[A-Za-z]/.test(valor) || !/\d/.test(valor)) return 'Combina letras y números.'
  return ''
}

export function confirmarContrasena(valor, original) {
  if (!valor) return 'Repite tu contraseña.'
  if (valor !== original) return 'Las contraseñas no coinciden.'
  return ''
}

export function requerido(mensaje) {
  return (valor) => (valor.trim() ? '' : mensaje)
}

export function maximo(caracteres) {
  return (valor) => (valor.length > caracteres ? `Máximo ${caracteres} caracteres.` : '')
}

// --- Pago ---

function pasaLuhn(digitos) {
  let suma = 0
  for (let i = 0; i < digitos.length; i++) {
    let n = Number(digitos[digitos.length - 1 - i])
    if (i % 2 === 1) {
      n *= 2
      if (n > 9) n -= 9
    }
    suma += n
  }
  return suma % 10 === 0
}

export function numeroTarjeta(valor) {
  const digitos = soloDigitos(valor)
  if (!digitos) return 'Ingresa el número de tu tarjeta.'
  if (digitos.length < 15 || digitos.length > 16) return 'El número de tarjeta debe tener 15 o 16 dígitos.'
  if (!pasaLuhn(digitos)) return 'El número de tarjeta no es válido. Revísalo.'
  return ''
}

export function vencimiento(valor) {
  const digitos = soloDigitos(valor)
  if (!digitos) return 'Ingresa la fecha de vencimiento.'
  if (digitos.length !== 4) return 'Usa el formato MM / AA.'
  const mes = Number(digitos.slice(0, 2))
  const anio = 2000 + Number(digitos.slice(2))
  if (mes < 1 || mes > 12) return 'El mes debe estar entre 01 y 12.'
  const ahora = new Date()
  const finDeMes = new Date(anio, mes, 0, 23, 59)
  if (finDeMes < ahora) return 'La tarjeta está vencida.'
  return ''
}

export function cvv(valor) {
  const digitos = soloDigitos(valor)
  if (!digitos) return 'Ingresa el código de seguridad.'
  if (digitos.length < 3 || digitos.length > 4) return 'El CVV tiene 3 o 4 dígitos.'
  return ''
}

export function nombreTarjeta(valor) {
  const limpio = valor.trim()
  if (!limpio) return 'Ingresa el nombre tal como aparece en la tarjeta.'
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(limpio)) return 'Usa solo letras y espacios.'
  return ''
}

export function codigoAprobacion(valor) {
  const digitos = soloDigitos(valor)
  if (!digitos) return 'Ingresa el código de aprobación.'
  if (digitos.length !== 6) return 'El código de aprobación tiene 6 dígitos.'
  return ''
}

// --- Máscaras de escritura ---

export function mascaraTarjeta(valor) {
  return soloDigitos(valor)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function mascaraVencimiento(valor) {
  const digitos = soloDigitos(valor).slice(0, 4)
  return digitos.length > 2 ? `${digitos.slice(0, 2)} / ${digitos.slice(2)}` : digitos
}

export function mascaraTelefono(valor) {
  return soloDigitos(valor)
    .slice(0, 9)
    .replace(/(\d{3})(?=\d)/g, '$1 ')
}

// Valida un objeto completo: { campo: validador } → { campo: mensaje }
export function validarTodo(valores, reglas) {
  const errores = {}
  for (const [campo, validar] of Object.entries(reglas)) {
    const error = validar(valores[campo] ?? '', valores)
    if (error) errores[campo] = error
  }
  return errores
}
