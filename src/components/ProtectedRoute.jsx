import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiFetch } from '../api.js'

const ProtectedRoute = ({ children, requiredPermission }) => {
  const [permissions, setPermissions] = useState(null)
  const [loading, setLoading] = useState(true)

  const adminRole = localStorage.getItem('adminRole')
  const isSuperAdmin = adminRole === 'SUPER_ADMIN' || adminRole === 'SUPERADMIN'

  useEffect(() => {
    const loadPermissions = async () => {
      // SuperAdmin has all permissions
      if (isSuperAdmin) {
        setPermissions({
          clientManagementEnabled: true,
          reportsEnabled: true,
          transactionsEnabled: true,
          administrationEnabled: true
        })
        setLoading(false)
        return
      }

      try {
        const adminId = localStorage.getItem('adminId')
        if (!adminId) {
          setLoading(false)
          return
        }

        const res = await apiFetch(`admins/${adminId}`)
        const responseData = await res.json()

        if (res.ok && responseData.success && responseData.data) {
          const adminData = responseData.data
          setPermissions({
            clientManagementEnabled: adminData.clientManagementEnabled || false,
            reportsEnabled: adminData.reportsEnabled || false,
            transactionsEnabled: adminData.transactionsEnabled || false,
            administrationEnabled: adminData.administrationEnabled || false
          })
        }
      } catch (err) {
        console.error('Load permissions error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPermissions()
  }, [isSuperAdmin])

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  if (!permissions) {
    return <Navigate to="/" replace />
  }

  // Check if user has required permission
  if (requiredPermission && !permissions[requiredPermission]) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
