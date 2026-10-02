// Destino tras iniciar sesión o registrarse: solo se permite volver a rutas internas del sitio.
export function destinoSeguro(params, porDefecto = '/perfil') {
  const destino = params.get('redirect')
  return destino?.startsWith('/') && !destino.startsWith('//') ? destino : porDefecto
}
