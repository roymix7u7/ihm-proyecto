import { useContext } from 'react'
import { ReservaContext } from '../context/contextos.js'

export default function useReserva() {
  return useContext(ReservaContext)
}
