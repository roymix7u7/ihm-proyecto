import { Route, Routes } from 'react-router'
import MainLayout from './components/layout/MainLayout.jsx'
import Home from './pages/Home.jsx'
import Proximamente from './pages/Proximamente.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        {/* Pantallas pendientes de implementar */}
        <Route path="ambientes" element={<Proximamente titulo="Nuestros Ambientes" />} />
        <Route path="ambientes/:slug" element={<Proximamente titulo="Detalle del ambiente" />} />
        <Route path="menu" element={<Proximamente titulo="Menú" />} />
        <Route path="reservar" element={<Proximamente titulo="Reservar" />} />
        <Route path="mi-reserva" element={<Proximamente titulo="Mi Reserva" />} />
        <Route path="login" element={<Proximamente titulo="Iniciar sesión" />} />
        <Route path="*" element={<Proximamente titulo="Página no encontrada" />} />
      </Route>
    </Routes>
  )
}
