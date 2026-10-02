import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

export default function MainLayout({ footerCompacto = false }) {
  const { pathname } = useLocation()

  // Al cambiar de pantalla, volver arriba como en una navegación normal.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer compacto={footerCompacto} />
    </div>
  )
}
