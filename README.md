# Ceniza · Alta Cocina de Origen

Este es el proyecto de IHM: la web de reservas del restaurante **Ceniza**, programada a partir de nuestro prototipo en Figma.

Está hecha con React, Vite y Tailwind, pero no necesitas saber nada de eso para verla. Solo sigue estos pasos 👇

---

## Antes de empezar (solo la primera vez)

Necesitas tener instaladas dos cosas en tu computadora:

- **Node.js**, versión 22 o más nueva → descárgalo de [nodejs.org](https://nodejs.org) (elige la versión que dice **LTS**).
- **Git** → descárgalo de [git-scm.com](https://git-scm.com).

¿No sabes si ya los tienes? Abre una terminal y escribe `node -v` y `git -v`. Si te sale un número de versión, ya está.

## Descargar el proyecto (solo la primera vez)

Abre una terminal en la carpeta donde quieras guardarlo y copia esto:

```bash
git clone https://github.com/roymix7u7/ihm-proyecto.git
cd ihm-proyecto
npm install
```

El último comando descarga todo lo que el proyecto necesita. Tarda uno o dos minutos, ten paciencia ☕

## Ver la página

Cada vez que quieras abrirla:

```bash
npm run dev
```

Luego entra a **http://localhost:5173** en tu navegador y listo 🎉

Mientras la terminal siga abierta, cualquier cambio que hagas en el código se verá al instante en la página. Para apagarla, presiona `Ctrl + C` en la terminal.

> 💡 Para ver cómo se ve en celular: presiona `F12` en el navegador y luego `Ctrl + Shift + M`.

## Antes de ponerte a trabajar

Trae siempre lo último que subieron los demás, así evitamos pisarnos el trabajo:

```bash
git pull
npm install
```

## Subir tus cambios

Cuando termines algo:

```bash
git add .
git commit -m "Qué hiciste, en pocas palabras"
git push
```

Para poder subir cambios, Roy tiene que agregarte primero como colaborador del repositorio. Pídeselo si aún no lo hizo.

> 🤝 Para no chocar entre nosotros, avisemos en el grupo qué pantalla está haciendo cada uno.

---

## ¿Algo no funciona?

- **"npm no se reconoce como comando"** → Falta instalar Node.js, o necesitas cerrar y volver a abrir la terminal después de instalarlo.
- **Sale un error que menciona la versión de Node** → Tienes una versión antigua. Instala la última LTS desde [nodejs.org](https://nodejs.org).
- **La página sale en blanco o con errores raros después de un `git pull`** → Corre `npm install` otra vez.
- **Nada de lo anterior** → Escribe en el grupo y lo vemos juntos 🙌
