# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Sitio web de reservas del restaurante ficticio **"Ceniza – Alta Cocina de Origen"** (curso IHM), programado a partir de un prototipo de Figma. Todo el contenido, nombres de archivos, componentes y variables está en **español**. Todas las pantallas del prototipo están implementadas y funcionan con datos simulados (sin backend).

- Figma: file key `hlzcPumT85vQXcHSGytQad`, página `0:1` "IHM ACTUALIZADO". Cada pantalla es un frame de 1440 px (`141:2` home, `145:2487` ambientes, `141:258` detalle, `141:355` menú, `141:717`…`141:1791` checkout, `145:2742` mi reserva, `152:508` login, `159:102` registro, `152:575` perfil, `152:640` editar perfil). Las pantallas "avisos" son estados de error de validación, no rutas aparte.
- Login, Registro, Perfil y Editar perfil se construyeron solo con la estructura y medidas de los metadatos de Figma (se agotó el límite de llamadas del plan Starter), así que sus textos son propios. Si se recupera acceso, comparar contra esos frames.
- El orden real del checkout es **Personas → Fecha y Hora → Ambiente → Datos → Resumen → Pago → Confirmación** (el stepper del frame del paso 1 en Figma tiene el orden invertido por error).
- El diseño solo trae escritorio; la versión responsive es decisión propia y debe mantenerse sin scroll horizontal a 390 px.

## Comandos

```bash
npm run dev       # servidor de desarrollo (Vite)
npm run build     # build de producción en dist/
npm run lint      # oxlint
```

No hay tests automatizados.

## Stack

React 19 + Vite 8 en **JavaScript**, **Tailwind CSS v4** vía `@tailwindcss/vite` (sin `tailwind.config.js`), **React Router v7** declarativo, `lucide-react` para íconos (los mismos que usa Figma) y `tailwind-merge`.

- **Tokens** en el `@theme` de `src/index.css` (`crema`, `carbon`, `grafito`, `oro`, `linea`, `arena`, `error`, `exito`, `salir`…; `font-serif` = Instrument Serif, `font-sans` = Geist vía `@fontsource`). Usarlos en vez de hex sueltos.
- `Button` y `Modal` combinan clases con `twMerge`, así que el `className` del llamador reemplaza a las clases base cuando chocan (tamaño de texto, `max-w`, `display`, etc.).

## Arquitectura

Organizada por funcionalidad, no por tipo de archivo:

- `src/datos/` — backend simulado. `src/modulos/` — una carpeta por flujo del usuario (`informacion`, `cuenta`, `reserva`, `mi-reserva`). `src/compartido/` — lo que usan varios módulos (`layout/`, `ui/`, `formularios/`, `fechas.js`). Cada contexto vive en el mismo archivo que su hook (`AuthContext` en `useAuth.js`, `ReservaContext` en `useReserva.js`).
- **Datos simulados** (`src/datos/`): única capa de acceso a datos, dividida en `bd.js` (lectura/escritura en `localStorage` con clave `ceniza-bd-v1`, semilla y retraso artificial), `usuarios.js`, `disponibilidad.js`, `pagos.js` y `reservas.js`. Guarda las tablas del modelo de BD del equipo (`usuarios`, `reservas`, `pagos`, `comprobantes`) con sus nombres de campo en snake_case. Para conectar un backend real se reemplazan sus funciones manteniendo las firmas. Los catálogos estáticos (`ambientes`, `platos`, `parametros`, `horarios_atencion`, `metodos_pago`) están en `src/datos/catalogos/`; los campos que el modelo no tiene están comentados.
- **Disponibilidad** (`datos/disponibilidad.js`): `estadoFecha`, `horariosDisponibles` y `disponibilidadAmbientes` combinan los horarios de atención, una ocupación pseudoaleatoria **determinista** (hash de fecha+hora+ambiente, para que sea coherente entre pantallas) y las reservas confirmadas guardadas. Lunes cerrado; se reserva desde mañana hasta +60 días.
- **Contextos**: `modulos/cuenta/AuthProvider.jsx` (sesión en `localStorage`) y `modulos/reserva/ReservaProvider.jsx` (borrador del checkout en `sessionStorage` + temporizador de 10 min calculado desde `borrador.inicio`).
- **Checkout** (`modulos/reserva/`): cada paso es una página en `pasos/` envuelta en `RequiereSesion` + `PasoProtegido` (redirige al primer paso con datos faltantes y arranca el temporizador). `CheckoutLayout` arma stepper + contenido + panel `ResumenMesa` + `Temporizador` (en `componentes/`), y muestra el modal de tiempo agotado. El borrador se limpia en `Confirmacion.jsx` al montar, **no** en `PasoPago`: la navegación de React Router es una transición y limpiar antes hace que `PasoProtegido` redirija al paso 2.
- **Pago simulado** (`datos/pagos.js`): la tarjeta `4000 0000 0000 0002` o el código `000000` en Yape/Plin se rechazan; cualquier otra tarjeta que pase Luhn se aprueba (p. ej. `4111 1111 1111 1111`).
- **Formularios** (`compartido/formularios/`): `useFormulario(inicial, reglas)` valida al salir de cada campo y al enviar; las reglas y máscaras están en `validaciones.js`. Componentes `Campo`, `EntradaContrasena`, `AvisoValidacion`, `Casilla`.
- **Layouts** (`compartido/layout/`): `MainLayout` (footer completo) y `MainLayout footerCompacto` para login, registro y perfil.

## Datos de demostración

Cuenta `carlos.menalv@gmail.com` / `Ceniza2026`, con una reserva sembrada (`CEN-2026-0831`). Para volver a los datos iniciales, borrar las claves `ceniza-*` de `localStorage` o llamar a `reiniciarDatosDemo()` (`datos/bd.js`).
