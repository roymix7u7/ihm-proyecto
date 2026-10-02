import { fechaLarga, personasTexto, soles } from './fechas.js'

const escapar = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// Genera un comprobante HTML imprimible y lo descarga en el navegador.
export function descargarComprobante(reserva) {
  const filas = [
    ['Código de reserva', reserva.codigo_reserva],
    ['Comprobante', reserva.comprobante?.numero ?? '—'],
    ['Ambiente', reserva.ambiente.nombre],
    ['Fecha', fechaLarga(reserva.fecha)],
    ['Hora', `${reserva.hora} hrs`],
    ['Personas', personasTexto(reserva.numero_comensales)],
    ['Titular', reserva.contacto.nombre],
    ['Correo', reserva.contacto.correo],
    ['Método de pago', reserva.metodoPago?.nombre ?? '—'],
    ['Garantía pagada', soles(reserva.monto_garantia)],
    ['Estado', reserva.estado === 'confirmada' ? 'Confirmada' : 'Cancelada'],
  ]

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Comprobante ${escapar(reserva.codigo_reserva)}</title>
<style>
  body{font-family:Georgia,serif;background:#faf8f5;color:#151515;margin:0;padding:48px}
  .hoja{max-width:640px;margin:auto;background:#fff;border:1px solid #ebe6de;padding:48px}
  h1{font-weight:normal;font-size:36px;margin:0}
  .marca{color:#c5a059;font:600 11px Arial,sans-serif;letter-spacing:.05em;text-transform:uppercase}
  table{width:100%;border-collapse:collapse;margin-top:32px;font:14px Arial,sans-serif}
  td{padding:12px 0;border-bottom:1px solid #ebe6de}
  td:last-child{text-align:right;font-weight:bold}
  p{font:12px Arial,sans-serif;color:#4a4a4a;line-height:1.5}
</style></head><body><div class="hoja">
  <h1>CENIZA</h1><div class="marca">Alta cocina de origen · Comprobante de garantía</div>
  <table>${filas.map(([k, v]) => `<tr><td>${escapar(k)}</td><td>${escapar(v)}</td></tr>`).join('')}</table>
  <p>Este monto se descontará de forma íntegra de su cuenta final de consumo en el restaurante.
  Av. Camino Real 1244, San Isidro, Lima · reservas@ceniza.pe · +51 1 422 8990</p>
  <p>Documento generado en modo demostración.</p>
</div></body></html>`

  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = `comprobante-${reserva.codigo_reserva}.html`
  enlace.click()
  URL.revokeObjectURL(url)
}
