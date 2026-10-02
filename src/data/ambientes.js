import balconListado from '../assets/ambientes/balcon-listado.png'
import jardinGaleria1 from '../assets/ambientes/jardin-galeria-1.png'
import jardinGaleria2 from '../assets/ambientes/jardin-galeria-2.png'
import jardinGaleriaPrincipal from '../assets/ambientes/jardin-galeria-principal.png'
import jardinListado from '../assets/ambientes/jardin-listado.png'
import jardinMiReserva from '../assets/ambientes/jardin-mi-reserva.png'
import jardinMomento1 from '../assets/ambientes/jardin-momento-1.png'
import jardinMomento2 from '../assets/ambientes/jardin-momento-2.png'
import jardinMomento3 from '../assets/ambientes/jardin-momento-3.png'
import segundoPisoListado from '../assets/ambientes/segundo-piso-listado.png'
import balconPortada from '../assets/home/ambiente-balcon.png'
import jardinPortada from '../assets/home/ambiente-jardin.png'
import segundoPisoPortada from '../assets/home/ambiente-segundo-piso.png'

// Datos de prueba con la forma de la tabla `ambientes` del modelo de BD.
// `imagenes` y `caracteristicas` corresponden a `ambientes_imagenes` y `ambientes_caracteristicas`.
// Campos que el modelo aún no tiene: categoria, resumen, descripcion_detalle, ubicacion, imagen_portada,
// imagen_reserva y momentos.
export const ambientes = [
  {
    id: 1,
    nombre: 'El Jardín Secreto',
    slug: 'jardin-secreto',
    categoria: 'Espacio Exterior',
    resumen:
      'Cene bajo el murmullo de hojas y la calidez de antorchas. Un refugio natural tallado en el corazón de la urbe.',
    descripcion:
      'Ubicado en el patio central de la antigua casona. Rodeado de vegetación madura y muros de piedra expuesta, ofrece la experiencia más poética bajo el cielo de San Isidro.',
    descripcion_detalle:
      'Sumérjase en una velada inigualable cobijada por el follaje natural y la sutil caricia de las antorchas. Nuestro jardín central equilibra a la perfección el aire místico del fogón con la excelencia de nuestro servicio de etiqueta. Las mesas están dispuestas asimétricamente para garantizar la máxima discreción entre comensales.',
    tipo_espacio: 'Exterior con Techo Retráctil',
    atmosfera: 'Mística y Orgánica',
    aforo_maximo: 16,
    es_activo: true,
    imagen_web: jardinListado,
    imagen_portada: jardinPortada,
    imagen_reserva: jardinMiReserva,
    ubicacion: 'Ubicación central al aire libre, calefactado e íntimo.',
    imagenes: [jardinGaleriaPrincipal, jardinGaleria1, jardinGaleria2],
    caracteristicas: [
      { tipo: 'Ambiente', valor: 'Mística, natural, intimista con iluminación directa de velas.' },
      { tipo: 'Ocasiones recomendadas', valor: 'Cenas de aniversario, pedidas de mano, encuentros diplomáticos.' },
      { tipo: 'Capacidad máxima', valor: 'Hasta 16 personas' },
      { tipo: 'Clima', valor: 'Techo retráctil automatizado que protege contra lloviznas finas.' },
    ],
    momentos: [jardinMomento1, jardinMomento2, jardinMomento3],
  },
  {
    id: 2,
    nombre: 'El Balcón Suspendido',
    slug: 'balcon-suspendido',
    categoria: 'Atmósfera Elevada',
    resumen:
      'La ciudad a sus pies a través de una perspectiva flotante. El maridaje perfecto entre intimidad urbana y aire libre.',
    descripcion:
      'Una extensión flotante en el nivel superior que combina la brisa de la tarde con el panorama urbano. Diseñado para quienes disfrutan de los cocteles de autor bajo el crepúsculo.',
    descripcion_detalle:
      'Suspendido sobre la ciudad, este balcón convierte cada atardecer en parte del menú. La brisa de la tarde, la luz cálida del crepúsculo y nuestra barra de cocteles de autor acompañan una cena pensada para conversar sin prisa, con Lima encendiéndose a sus pies.',
    tipo_espacio: 'Semicubierto Elevado',
    atmosfera: 'Moderna e Íntima',
    aforo_maximo: 12,
    es_activo: true,
    imagen_web: balconListado,
    imagen_portada: balconPortada,
    imagen_reserva: balconListado,
    ubicacion: 'Nivel superior semicubierto, con vista panorámica a la ciudad.',
    imagenes: [balconListado, balconPortada],
    caracteristicas: [
      { tipo: 'Ambiente', valor: 'Moderno, íntimo, con vista panorámica a la ciudad.' },
      { tipo: 'Ocasiones recomendadas', valor: 'Primeras citas, celebraciones al atardecer, cocteles de grupo.' },
      { tipo: 'Capacidad máxima', valor: 'Hasta 12 personas' },
      { tipo: 'Clima', valor: 'Cubierta parcial de vidrio y calefactores para las noches frescas.' },
    ],
    momentos: [],
  },
  {
    id: 3,
    nombre: 'El Segundo Piso',
    slug: 'segundo-piso',
    categoria: 'Salón Privado',
    resumen:
      'Artesanía, maderas oscuras y una cava de autor de techos altos. Diseñado para largas sobremesas de negocios y confidencias.',
    descripcion:
      'El corazón maderero del restaurante. Con un diseño de luz ultra-filtrada, este salón alberga las obras de arte más exclusivas y nuestra joya: la cava privada de añadas históricas.',
    descripcion_detalle:
      'Maderas nobles, luz tenue y el silencio justo para las conversaciones importantes. El Segundo Piso rodea a sus invitados con nuestra cava privada de añadas históricas y una selección de obras de arte, ideal para reuniones que merecen privacidad absoluta.',
    tipo_espacio: 'Interior Climatizado',
    atmosfera: 'Solemne e Intelectual',
    aforo_maximo: 20,
    es_activo: true,
    imagen_web: segundoPisoListado,
    imagen_portada: segundoPisoPortada,
    imagen_reserva: segundoPisoListado,
    ubicacion: 'Salón interior privado junto a nuestra cava de autor.',
    imagenes: [segundoPisoListado, segundoPisoPortada],
    caracteristicas: [
      { tipo: 'Ambiente', valor: 'Solemne, cálido, rodeado de madera y arte.' },
      { tipo: 'Ocasiones recomendadas', valor: 'Cenas de negocios, celebraciones familiares, catas privadas.' },
      { tipo: 'Capacidad máxima', valor: 'Hasta 20 personas' },
      { tipo: 'Clima', valor: 'Interior climatizado con control de temperatura y acústica.' },
    ],
    momentos: [],
  },
]

export function buscarAmbiente(slug) {
  return ambientes.find((ambiente) => ambiente.slug === slug)
}

export function buscarAmbientePorId(id) {
  return ambientes.find((ambiente) => ambiente.id === id)
}
