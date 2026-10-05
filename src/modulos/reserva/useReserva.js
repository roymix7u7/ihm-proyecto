import { createContext, useContext } from 'react'

export const ReservaContext = createContext(null)

export default function useReserva() {
  return useContext(ReservaContext)
}
