// Datos de prueba con la forma de las tablas `parametros`, `horarios_atencion` y `metodos_pago`.

export const parametros = {
  garantia_por_persona: 30,
  minutos_para_completar: 10,
  personas_minimo: 2,
  personas_maximo: 20,
  dias_anticipacion_maxima: 60,
  tolerancia_minutos: 15,
}

// dia_semana: 0 = domingo … 6 = sábado (igual que Date.getDay()). Los lunes no se atiende.
// `turnos` son las horas de llegada que se pueden reservar dentro de cada horario.
export const horariosAtencion = [
  { id: 1, dia_semana: 0, hora_apertura: '13:00', hora_cierre: '17:00', turnos: ['13:00', '14:00', '15:00', '16:00'] },
  ...[2, 3, 4, 5, 6].flatMap((dia) => [
    { id: dia * 10 + 1, dia_semana: dia, hora_apertura: '13:00', hora_cierre: '16:00', turnos: ['13:00', '14:00', '15:00'] },
    {
      id: dia * 10 + 2,
      dia_semana: dia,
      hora_apertura: '19:30',
      hora_cierre: '23:00',
      turnos: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00'],
    },
  ]),
].map((horario) => ({ ...horario, es_activo: true }))

export const metodosPago = [
  { id: 1, clave: 'tarjeta', nombre: 'Tarjeta de Crédito / Débito', is_active: true },
  { id: 2, clave: 'yape', nombre: 'Yape', is_active: true },
  { id: 3, clave: 'plin', nombre: 'Plin', is_active: true },
]

// Datos de prueba para la demostración del pago simulado.
export const TARJETA_RECHAZADA = '4000000000000002'
export const CODIGO_BILLETERA_RECHAZADO = '000000'
