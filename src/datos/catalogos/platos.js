import asadoDeTira from '../../assets/menu/asado-de-tira.png'
import betarragas from '../../assets/menu/betarragas.png'
import cacao from '../../assets/menu/cacao.png'
import pato from '../../assets/menu/pato.png'
import vieiras from '../../assets/menu/vieiras.png'

// Datos de prueba con la forma de las tablas `temporadas_menu`, `categorias_menu` y `platos`.
// `etiquetas` (dieta y alérgenos) es un campo que el modelo aún no tiene.
export const temporadaActiva = { id: 1, nombre: 'Temporada de Otoño – Invierno', is_active: true }

export const categoriasMenu = [
  { id: 1, nombre: 'Entradas del Huerto y del Mar', position: 1 },
  { id: 2, nombre: 'Platos de Brasa y Cocción Lenta', position: 2 },
  { id: 3, nombre: 'El Dulce Deslace', position: 3 },
]

export const platos = [
  {
    id: 1,
    categorias_menu_id: 1,
    temporadas_menu_id: 1,
    is_active: true,
    nombre: 'Vieiras templadas en leña de cerezo',
    descripcion:
      'Acompañadas de una sedosa emulsión de castañas amazónicas, aceite de eneldo prensado y láminas crujientes de hongo trufado.',
    imagen_path: vieiras,
    etiquetas: ['mariscos', 'frutos-secos'],
  },
  {
    id: 2,
    categorias_menu_id: 1,
    temporadas_menu_id: 1,
    is_active: true,
    nombre: 'Betarragas tatemadas al rescoldo',
    descripcion:
      'Betarragas orgánicas cocidas lentamente sobre ceniza mineral, queso de cabra artesanal curado, brotes y vinagreta de saúco silvestre.',
    imagen_path: betarragas,
    etiquetas: ['vegetariano', 'lacteos'],
  },
  {
    id: 3,
    categorias_menu_id: 2,
    temporadas_menu_id: 1,
    is_active: true,
    nombre: 'Pato madurado en horno de barro y leña',
    descripcion:
      'Pechuga glaseada con miel de abejas nativas, acompañado de arroz meloso norteño y raíces de yuca confitadas en humo graso.',
    imagen_path: pato,
    etiquetas: ['carne'],
  },
  {
    id: 4,
    categorias_menu_id: 2,
    temporadas_menu_id: 1,
    is_active: true,
    nombre: 'Asado de tira curado al vacío (48 horas)',
    descripcion:
      'Carne angus sumamente suave, braseada en sarmientos de vid, puré de pallares trufado y texturas de chalotas asadas.',
    imagen_path: asadoDeTira,
    etiquetas: ['carne'],
  },
  {
    id: 5,
    categorias_menu_id: 3,
    temporadas_menu_id: 1,
    is_active: true,
    nombre: 'Texturas de Cacao de Origen Ahumado',
    descripcion:
      'Helado cremoso de chocolate al 75% infusionado con madera de manzano, tierra de frutos secos y teja crujiente de azúcar.',
    imagen_path: cacao,
    etiquetas: ['postre'],
  },
]

export const etiquetas = {
  mariscos: { label: 'Mariscos', clase: 'bg-[#b9e9ed] text-[#017e87]' },
  'frutos-secos': { label: 'Contiene frutos secos', clase: 'bg-[#fff7d7] text-[#b49000]' },
  vegetariano: { label: 'Vegetariano', clase: 'bg-[#daffe3] text-[#2ea84d]' },
  lacteos: { label: 'Contiene lácteos', clase: 'bg-[#f3ece3] text-oro' },
  carne: { label: 'Carne', clase: 'bg-[#ffe9e9] text-[#cf4e50]' },
  postre: { label: 'Postre', clase: 'bg-[#ffeee2] text-[#ac7f5e]' },
}

// Textos de la sección "Destacados de Nuestra Carta" del Home (no son platos de la carta actual).
export const destacadosHome = [
  {
    id: 1,
    nombre: 'Vieiras al Humo de Manzano',
    descripcion:
      'Vieiras frescas de bahía, marinadas en cítricos locales, ahumadas suavemente en frío y terminadas con emulsión de cenizas vegetales.',
  },
  {
    id: 2,
    nombre: 'Pesca de Profundidad con Costra de Carbón',
    descripcion:
      'Filete premium curado, sellado a alta temperatura en costra de carbón activado, salsa de ajíes nativos tatemados.',
  },
  {
    id: 3,
    nombre: 'Magret de Pato con Reducción de Algarrobo',
    descripcion:
      'Pato madurado en cámara de ceniza mineral, asado lentamente al fuego de leña gruesa, acompañado de puré rústico de raíces.',
  },
  {
    id: 4,
    nombre: 'Infusión Dulce de Ceniza y Cacao',
    descripcion:
      'Texturas de cacao al 70%, mousse helada perfumada con madera de cerezo ahumado y teja crocante de azúcar soplada.',
  },
]
