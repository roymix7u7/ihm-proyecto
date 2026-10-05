import { Route, Routes } from 'react-router'
import RequiereSesion from './modulos/cuenta/RequiereSesion.jsx'
import EntradaReserva from './modulos/reserva/EntradaReserva.jsx'
import PasoProtegido from './modulos/reserva/PasoProtegido.jsx'
import MainLayout from './compartido/layout/MainLayout.jsx'
import AmbienteDetalle from './modulos/informacion/AmbienteDetalle.jsx'
import Ambientes from './modulos/informacion/Ambientes.jsx'
import Confirmacion from './modulos/reserva/pasos/Confirmacion.jsx'
import PasoAmbiente from './modulos/reserva/pasos/PasoAmbiente.jsx'
import PasoDatos from './modulos/reserva/pasos/PasoDatos.jsx'
import PasoFechaHora from './modulos/reserva/pasos/PasoFechaHora.jsx'
import PasoPago from './modulos/reserva/pasos/PasoPago.jsx'
import PasoPersonas from './modulos/reserva/pasos/PasoPersonas.jsx'
import PasoResumen from './modulos/reserva/pasos/PasoResumen.jsx'
import EditarPerfil from './modulos/cuenta/EditarPerfil.jsx'
import Login from './modulos/cuenta/Login.jsx'
import Perfil from './modulos/cuenta/Perfil.jsx'
import Registro from './modulos/cuenta/Registro.jsx'
import Home from './modulos/informacion/Home.jsx'
import Menu from './modulos/informacion/Menu.jsx'
import MiReserva from './modulos/mi-reserva/MiReserva.jsx'
import Proximamente from './compartido/layout/Proximamente.jsx'

const pasosReserva = [
  { ruta: 'personas', paso: 1, Pagina: PasoPersonas },
  { ruta: 'fecha-hora', paso: 2, Pagina: PasoFechaHora },
  { ruta: 'ambiente', paso: 3, Pagina: PasoAmbiente },
  { ruta: 'datos', paso: 4, Pagina: PasoDatos },
  { ruta: 'resumen', paso: 5, Pagina: PasoResumen },
  { ruta: 'pago', paso: 6, Pagina: PasoPago },
]

const conSesion = (pagina) => <RequiereSesion>{pagina}</RequiereSesion>

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="ambientes" element={<Ambientes />} />
        <Route path="ambientes/:slug" element={<AmbienteDetalle />} />
        <Route path="menu" element={<Menu />} />

        <Route path="reservar" element={conSesion(<EntradaReserva />)} />
        {pasosReserva.map(({ ruta, paso, Pagina }) => (
          <Route
            key={ruta}
            path={`reservar/${ruta}`}
            element={conSesion(
              <PasoProtegido paso={paso}>
                <Pagina />
              </PasoProtegido>,
            )}
          />
        ))}
        <Route path="reservar/confirmacion/:codigo" element={conSesion(<Confirmacion />)} />

        <Route path="mi-reserva" element={conSesion(<MiReserva />)} />
        <Route path="mi-reserva/:codigo" element={conSesion(<MiReserva />)} />
        <Route path="*" element={<Proximamente titulo="Página no encontrada" etiqueta="Error 404" />} />
      </Route>

      <Route element={<MainLayout footerCompacto />}>
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="perfil" element={conSesion(<Perfil />)} />
        <Route path="perfil/editar" element={conSesion(<EditarPerfil />)} />
      </Route>
    </Routes>
  )
}
