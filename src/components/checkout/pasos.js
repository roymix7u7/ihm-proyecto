export const pasos = [
  { numero: 1, label: 'Personas', ruta: '/reservar/personas' },
  { numero: 2, label: 'Fecha y Hora', ruta: '/reservar/fecha-hora' },
  { numero: 3, label: 'Ambiente', ruta: '/reservar/ambiente' },
  { numero: 4, label: 'Datos', ruta: '/reservar/datos' },
  { numero: 5, label: 'Resumen', ruta: '/reservar/resumen' },
  { numero: 6, label: 'Pago', ruta: '/reservar/pago' },
  { numero: 7, label: 'Confirmación', ruta: null },
]

export const rutaPaso = (numero) => pasos[numero - 1].ruta
