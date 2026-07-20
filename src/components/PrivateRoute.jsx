import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Guards routes that require an authenticated user (e.g. future
// /comunidad/nuevo, /comunidad/mis-espacios). Not wired to any route yet in
// this phase — kept ready for when create/edit/delete ships.
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!user) return <Navigate to="/comunidad/acceso" replace state={{ from: location }} />
  return children
}
