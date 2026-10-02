import { useCallback, useMemo, useState } from 'react'
import * as api from '../services/api.js'
import { AuthContext } from './contextos.js'

const CLAVE_SESION = 'ceniza-sesion'

function sesionGuardada() {
  try {
    const id = Number(localStorage.getItem(CLAVE_SESION))
    return id ? api.obtenerUsuario(id) : null
  } catch {
    return null
  }
}

function recordarSesion(id) {
  try {
    if (id) localStorage.setItem(CLAVE_SESION, String(id))
    else localStorage.removeItem(CLAVE_SESION)
  } catch {
    // Sin almacenamiento: la sesión dura hasta recargar la página.
  }
}

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(sesionGuardada)

  const iniciarSesion = useCallback(async (correo, password) => {
    const datos = await api.iniciarSesion(correo, password)
    recordarSesion(datos.id)
    setUsuario(datos)
    return datos
  }, [])

  const registrar = useCallback(async (datos) => {
    const nuevo = await api.registrarUsuario(datos)
    recordarSesion(nuevo.id)
    setUsuario(nuevo)
    return nuevo
  }, [])

  const actualizarPerfil = useCallback(
    async (datos) => {
      const actualizado = await api.actualizarUsuario(usuario.id, datos)
      setUsuario(actualizado)
      return actualizado
    },
    [usuario],
  )

  const cerrarSesion = useCallback(() => {
    recordarSesion(null)
    setUsuario(null)
  }, [])

  const valor = useMemo(
    () => ({ usuario, iniciarSesion, registrar, actualizarPerfil, cerrarSesion }),
    [usuario, iniciarSesion, registrar, actualizarPerfil, cerrarSesion],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
