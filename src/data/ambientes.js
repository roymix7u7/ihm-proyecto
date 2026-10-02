import imgBalcon from '../assets/home/ambiente-balcon.png'
import imgJardin from '../assets/home/ambiente-jardin.png'
import imgSegundoPiso from '../assets/home/ambiente-segundo-piso.png'

// Datos de prueba con la forma de la tabla `ambientes` del modelo de BD.
// `categoria` y `resumen` son textos del Home que el modelo aún no tiene.
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
    tipo_espacio: 'Exterior con Techo Retráctil',
    atmosfera: 'Mística y Orgánica',
    aforo_maximo: 16,
    es_activo: true,
    imagen_web: imgJardin,
  },
  {
    id: 2,
    nombre: 'El Balcón Suspendido',
    slug: 'balcon-suspendido',
    categoria: 'Atmósfera Elevada',
    resumen:
      'La ciudad a sus pies a través de una perspectiva flotante. El maridaje perfecto entre intimidad urbana y aire libre.',
    descripcion:
      'Una extensión flotante en el nivel superior que combina la brisa de la tarde con el panorama urbano. Diseñado para quienes disfrutan de los cócteles de autor bajo el crepúsculo.',
    tipo_espacio: 'Semicubierto Elevado',
    atmosfera: 'Moderna e Íntima',
    aforo_maximo: 12,
    es_activo: true,
    imagen_web: imgBalcon,
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
    tipo_espacio: 'Interior Climatizado',
    atmosfera: 'Solemne e Intelectual',
    aforo_maximo: 20,
    es_activo: true,
    imagen_web: imgSegundoPiso,
  },
]
