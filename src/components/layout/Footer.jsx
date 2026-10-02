const columnas = [
  {
    titulo: 'Horario',
    ancho: 'sm:w-[200px]',
    filas: [
      { texto: 'Martes a Sábado' },
      { texto: '13:00 – 16:00 | 19:30 – 23:00', secundario: true },
      { texto: 'Domingo' },
      { texto: '13:00 – 17:00', secundario: true },
    ],
  },
  {
    titulo: 'Contacto',
    ancho: 'sm:w-[200px]',
    filas: [
      { texto: 'Av. Camino Real 1244' },
      { texto: 'San Isidro, Lima', secundario: true },
      { texto: 'reservas@ceniza.pe', href: 'mailto:reservas@ceniza.pe' },
      { texto: '+51 1 422 8990', href: 'tel:+5114228990', secundario: true },
    ],
  },
  {
    titulo: 'Social',
    ancho: 'sm:w-[120px]',
    filas: [{ texto: 'Instagram', href: '#' }, { texto: 'Facebook', href: '#' }, { texto: 'Spotify', href: '#' }],
  },
]

export default function Footer() {
  return (
    <footer className="flex flex-col gap-16 bg-carbon px-5 pt-16 pb-10 text-crema md:px-10 lg:px-20 lg:pt-[100px] lg:pb-[60px]">
      <div className="flex flex-col justify-between gap-12 lg:flex-row">
        <div className="flex max-w-[400px] flex-col gap-6">
          <div className="flex flex-col gap-1 whitespace-nowrap">
            <p className="font-serif text-[44px] leading-none">CENIZA</p>
            <p className="text-[11px] font-semibold uppercase text-oro">Alta Cocina de Origen</p>
          </div>
          <p className="text-sm leading-[1.6] opacity-70">
            Un homenaje a los fuegos primigenios y la herencia gastronómica. Platos esculpidos por el humo, la tierra y
            la paciencia.
          </p>
        </div>

        <div className="grid gap-10 sm:flex sm:gap-20">
          {columnas.map((columna) => (
            <div key={columna.titulo} className={`flex flex-col gap-5 ${columna.ancho}`}>
              <h2 className="text-xs font-bold uppercase text-oro">{columna.titulo}</h2>
              <ul className="flex flex-col gap-2">
                {columna.filas.map((fila) => {
                  const clase = fila.secundario ? 'text-[13px] opacity-60' : 'text-sm opacity-90'
                  return (
                    <li key={fila.texto} className={clase}>
                      {fila.href ? (
                        <a href={fila.href} className="hover:text-oro">
                          {fila.texto}
                        </a>
                      ) : (
                        fila.texto
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2 border-t border-linea/10 pt-16 text-xs sm:flex-row">
        <p className="opacity-40">© 2026 Ceniza Alta Cocina. Reservados todos los derechos.</p>
        <p className="opacity-40">Diseño Editorial y Gastronómico</p>
      </div>
    </footer>
  )
}
