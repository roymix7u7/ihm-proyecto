import { Route, Routes } from 'react-router'
import RequiereSesion from './components/auth/RequiereSesion.jsx'
import EntradaReserva from './components/checkout/EntradaReserva.jsx'
import PasoProtegido from './components/checkout/PasoProtegido.jsx'
import MainLayout from './components/layout/MainLayout.jsx'
import AmbienteDetalle from './pages/AmbienteDetalle.jsx'
import Ambientes from './pages/Ambientes.jsx'
import Confirmacion from './pages/checkout/Confirmacion.jsx'
import PasoAmbiente from './pages/checkout/PasoAmbiente.jsx'
import PasoDatos from './pages/checkout/PasoDatos.jsx'
import PasoFechaHora from './pages/checkout/PasoFechaHora.jsx'
import PasoPago from './pages/checkout/PasoPago.jsx'
import PasoPersonas from './pages/checkout/PasoPersonas.jsx'
import PasoResumen from './pages/checkout/PasoResumen.jsx'
import EditarPerfil from './pages/cuenta/EditarPerfil.jsx'
import Login from './pages/cuenta/Login.jsx'
import Perfil from './pages/cuenta/Perfil.jsx'
import Registro from './pages/cuenta/Registro.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import MiReserva from './pages/MiReserva.jsx'
import Proximamente from './pages/Proximamente.jsx'

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
