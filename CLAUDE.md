# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Sitio web de reservas del restaurante ficticio **"Ceniza – Alta Cocina de Origen"** (curso IHM). Se implementa pantalla por pantalla a partir de un prototipo de Figma. Todo el contenido, nombres de archivos, componentes y variables está en **español**.

- Figma: file key `hlzcPumT85vQXcHSGytQad`, página `0:1` "IHM ACTUALIZADO". Cada pantalla es un frame de 1440 px (p. ej. `141:2` homepage, `145:2487` ambientes-listing, `141:717`…`141:1791` checkout de 7 pasos, `152:508` login, `159:102` registro). Las pantallas "avisos" son estados de error de validación de la misma pantalla, no rutas aparte.
- El diseño solo trae escritorio; la versión responsive (móvil/tablet) es decisión propia y se debe mantener sin scroll horizontal a 390 px.

## Comandos

```bash
npm run dev       # servidor de desarrollo (Vite)
npm run build     # build de producción en dist/
npm run preview   # servir el build
npm run lint      # oxlint
```

No hay tests configurados.

## Stack y arquitectura

- **React 19 + Vite 8, JavaScript (sin TypeScript)**, **Tailwind CSS v4** vía `@tailwindcss/vite` (no hay `tailwind.config.js`), **React Router v7** en modo declarativo (`BrowserRouter` en `main.jsx`, `<Routes>` en `App.jsx`).
- **Tokens de diseño** en el bloque `@theme` de `src/index.css`: colores `crema`, `carbon`, `grafito`, `oro`, `linea`, `icono`; fuentes `font-serif` (Instrument Serif, títulos) y `font-sans` (Geist, todo lo demás). Las fuentes vienen de paquetes `@fontsource`, no de Google Fonts. Usar estos tokens en vez de hex sueltos.
- **Layout**: `MainLayout` (Navbar + `<Outlet>` + Footer) envuelve todas las rutas. Las rutas sin pantalla implementada apuntan a `pages/Proximamente.jsx`.
- **Componentes UI**: `components/ui/Button.jsx` (variantes `oro`, `oscuro`, `contorno-claro`, `contorno-oscuro`; con `to` renderiza `<Link>`; el padding se pasa por `className` porque varía por botón) y `Eyebrow.jsx` (sobretítulo dorado en mayúsculas).
  - Button incluye `inline-flex` en sus clases base: para ocultarlo responsivamente usar `max-sm:hidden`/`max-lg:hidden`, no `hidden sm:inline-flex` (el `inline-flex` base gana a `hidden`).
- **Datos**: no hay backend. `src/data/*.js` contiene datos de prueba con la **misma forma que las tablas del modelo de BD** del equipo (`ambientes`, `platos`, y más adelante `categorias_menu`, `temporadas_menu`, `horarios_atencion`, `disponibilidades`, `reservas`, `pagos`, `metodos_pago`, `comprobantes`, `usuarios`, `parametros`). Mantener los nombres de campo en snake_case del modelo para facilitar conectar una API después. Campos extra que el modelo no tiene (p. ej. `ambientes.categoria`, `ambientes.resumen`) están comentados como tales.
- **Imágenes** exportadas de Figma en `src/assets/<pantalla>/`, íconos SVG en `src/assets/icons/`.

## Flujo para implementar una pantalla de Figma

1. `get_design_context` del frame (Figma MCP) para obtener estructura, textos exactos y assets; descargar los assets a `src/assets/` (las URLs de Figma expiran en 7 días).
2. Traducir el código generado (posiciones absolutas) a flex/grid responsive reutilizando Navbar/Footer/Button/Eyebrow y los tokens.
3. Verificar comparando capturas del build (escritorio 1440 px y móvil 390 px) contra el screenshot de Figma.
