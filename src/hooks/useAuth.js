import { useContext } from 'react'
import { AuthContext } from '../context/contextos.js'

export default function useAuth() {
  return useContext(AuthContext)
}
