import { useCallback, useState } from 'react'
import { validarTodo } from './validaciones.js'

// Estado de un formulario con validación al salir de cada campo y al enviar.
// `reglas` es { campo: (valor, todos) => mensaje }.
export default function useFormulario(inicial, reglas) {
  const [valores, setValores] = useState(inicial)
  const [errores, setErrores] = useState({})
  const [tocados, setTocados] = useState({})
  const [intentoEnviar, setIntentoEnviar] = useState(false)

  const validarCampo = useCallback(
    (campo, todos) => {
      const regla = reglas[campo]
      return regla ? regla(todos[campo] ?? '', todos) : ''
    },
    [reglas],
  )

  const cambiar = useCallback(
    (campo, valor) => {
      const nuevos = { ...valores, [campo]: valor }
      setValores(nuevos)
      // Si el campo ya mostraba error, se revalida mientras se escribe para quitarlo al corregir.
      if (errores[campo] || intentoEnviar) {
        const siguiente = { ...errores, [campo]: validarCampo(campo, nuevos) }
        if (!siguiente[campo]) delete siguiente[campo]
        setErrores(siguiente)
      }
    },
    [errores, intentoEnviar, validarCampo, valores],
  )

  const salir = useCallback(
    (campo) => {
      setTocados((previos) => ({ ...previos, [campo]: true }))
      setErrores((previos) => {
        const error = validarCampo(campo, valores)
        const siguiente = { ...previos }
        if (error) siguiente[campo] = error
        else delete siguiente[campo]
        return siguiente
      })
    },
    [validarCampo, valores],
  )

  // Devuelve true si todo es válido; si no, marca los errores.
  const validar = useCallback(() => {
    setIntentoEnviar(true)
    const encontrados = validarTodo(valores, reglas)
    setErrores(encontrados)
    return Object.keys(encontrados).length === 0
  }, [reglas, valores])

  const props = (campo) => ({
    id: campo,
    name: campo,
    value: valores[campo] ?? '',
    onChange: (e) => cambiar(campo, e.target.value),
    onBlur: () => salir(campo),
    'aria-invalid': errores[campo] ? true : undefined,
    'aria-describedby': errores[campo] ? `${campo}-error` : undefined,
  })

  return { valores, errores, tocados, intentoEnviar, cambiar, setErrores, setValores, validar, props }
}
