import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../../context.js'
import { ChevronLeft, Edit, Trash2, UsersIcon, ArrowLeftRight, BarChart, UserCog, RotateCcw } from 'lucide-react'
import '../../styles/Clients.css'
import '../../styles/Admins.css'
import { apiFetch } from '../../api.js'

const AdminDetails = () => {
  const { t } = useGlobalContext()
  const navigate = useNavigate()
  const { adminId } = useParams()
  const location = useLocation()

  const adminFromState = location.state?.admin

  const [admin, setAdmin] = useState(adminFromState || {
    id: adminId,
    name: 'Иван Иванов',
    email: 'example@gmail.com',
    phone: '+7 800 323 02 84',
    password: '12345',
    deleted: false
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedAdmin, setEditedAdmin] = useState({
    name: admin.name,
    surname: admin.surname || '',
    email: admin.email,
    phone: admin.phone || '+998',
    password: ''
  })

  const [permissions, setPermissions] = useState({
    clientManagementEnabled: false,
    reportsEnabled: false,
    transactionsEnabled: false,
    administrationEnabled: false,
    deleted: false
  })
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)
  const [isUpdatingPermission, setIsUpdatingPermission] = useState(false)
  const [isDeletingRestoring, setIsDeletingRestoring] = useState(false)
  const [isSavingAdmin, setIsSavingAdmin] = useState(false)

  // Get admin role from localStorage
  const adminRole = localStorage.getItem('adminRole')
  const isSuperAdmin = adminRole === 'SUPER_ADMIN' || adminRole === 'SUPERADMIN'

  // Load admin data and permissions from backend
  useEffect(() => {
    const loadAdminData = async () => {
      if (!adminId) return

      setIsLoadingPermissions(true)
      try {
        const res = await apiFetch(`admins/${adminId}`)
        const responseData = await res.json()

        console.log('Load admin data response:', responseData)

        if (res.ok && responseData.success && responseData.data) {
          const adminData = responseData.data

          // Set admin info
          setAdmin(adminData)
          setEditedAdmin({
            name: adminData.name || '',
            surname: adminData.surname || '',
            email: adminData.email || '',
            phone: adminData.phone || '+998',
            password: '' // Don't show actual password
          })

          // Set permissions from the same response
          setPermissions({
            clientManagementEnabled: adminData.clientManagementEnabled || false,
            reportsEnabled: adminData.reportsEnabled || false,
            transactionsEnabled: adminData.transactionsEnabled || false,
            administrationEnabled: adminData.administrationEnabled || false,
            deleted: adminData.deleted || false
          })
        }
      } catch (err) {
        console.error('Load admin data error:', err)
      } finally {
        setIsLoadingPermissions(false)
      }
    }

    // Only load if we don't have admin data from navigation state
    if (!adminFromState) {
      loadAdminData()
    } else {
      // If we have admin from state, also set permissions
      setPermissions({
        clientManagementEnabled: adminFromState.clientManagementEnabled || false,
        reportsEnabled: adminFromState.reportsEnabled || false,
        transactionsEnabled: adminFromState.transactionsEnabled || false,
        administrationEnabled: adminFromState.administrationEnabled || false,
        deleted: adminFromState.deleted || false
      })
    }
  }, [adminId, adminFromState])

  const togglePermission = async (key) => {
    if (!isSuperAdmin || isUpdatingPermission) return

    const newValue = !permissions[key]

    // Optimistically update UI
    setPermissions(prev => ({ ...prev, [key]: newValue }))
    setIsUpdatingPermission(true)

    try {
      // PATCH /api/admins/{adminId}/permissions with all permissions
      const requestBody = {
        clientManagementEnabled: key === 'clientManagementEnabled' ? newValue : permissions.clientManagementEnabled,
        reportsEnabled: key === 'reportsEnabled' ? newValue : permissions.reportsEnabled,
        transactionsEnabled: key === 'transactionsEnabled' ? newValue : permissions.transactionsEnabled,
        administrationEnabled: key === 'administrationEnabled' ? newValue : permissions.administrationEnabled,
        deleted: key === 'deleted' ? newValue : permissions.deleted
      }

      console.log('Toggle permission request body:', requestBody)

      const res = await apiFetch(`admins/${adminId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const responseData = await res.json()

      console.log('Update permission response:', responseData)

      if (!res.ok) {
        // Revert on error
        setPermissions(prev => ({ ...prev, [key]: !newValue }))
        alert(responseData.message || 'Ошибка при обновлении прав доступа')
      } else if (responseData.success && responseData.data) {
        // Update permissions from server response to stay in sync
        const adminData = responseData.data
        setPermissions({
          clientManagementEnabled: adminData.clientManagementEnabled || false,
          reportsEnabled: adminData.reportsEnabled || false,
          transactionsEnabled: adminData.transactionsEnabled || false,
          administrationEnabled: adminData.administrationEnabled || false,
          deleted: adminData.deleted || false
        })

        // Also update admin state
        setAdmin(prev => ({ ...prev, deleted: adminData.deleted || false }))
      }
    } catch (err) {
      console.error('Update permission error:', err)
      // Revert on error
      setPermissions(prev => ({ ...prev, [key]: !newValue }))
      alert(t('networkError') || 'Сетевая ошибка')
    } finally {
      setIsUpdatingPermission(false)
    }
  }

  const handleSaveAdmin = async () => {
    if (isSavingAdmin) return

    // Check permissions: only SUPER_ADMIN or the admin themselves can edit
    const currentAdminId = localStorage.getItem('adminId')
    const canEdit = isSuperAdmin || (currentAdminId && currentAdminId === adminId)

    if (!canEdit) {
      alert(t('noPermission') || 'У вас нет прав для редактирования этого администратора')
      return
    }

    // Validation
    if (!editedAdmin.name?.trim() || !editedAdmin.email?.trim()) {
      alert(t('fillAllFields') || 'Заполните все обязательные поля')
      return
    }

    setIsSavingAdmin(true)

    try {
      // According to Swagger: only email and phone can be updated
      const res = await apiFetch(`admins/${adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: editedAdmin.email.trim(),
          phone: editedAdmin.phone?.trim() || ''
        })
      })

      const responseData = await res.json()

      console.log('Update admin response:', responseData)

      if (!res.ok) {
        alert(responseData.message || 'Ошибка при обновлении админа')
        return
      }

      alert(t('adminUpdated') || 'Администратор успешно обновлен')

      // Update local state
      setAdmin(prev => ({
        ...prev,
        name: editedAdmin.name,
        surname: editedAdmin.surname,
        email: editedAdmin.email,
        phone: editedAdmin.phone,
        password: editedAdmin.password
      }))

      setIsEditing(false)
    } catch (err) {
      console.error('Update admin error:', err)
      alert(t('networkError') || 'Сетевая ошибка')
    } finally {
      setIsSavingAdmin(false)
    }
  }

  const handleDeleteRestore = async () => {
    if (!isSuperAdmin || isDeletingRestoring) return

    const isDeleted = admin.deleted || permissions.deleted
    const action = isDeleted ? 'restore' : 'delete'
    const confirmMessage = isDeleted
      ? (t('confirmRestore') || 'Вы уверены, что хотите восстановить этого администратора?')
      : (t('confirmDelete') || 'Вы уверены, что хотите удалить этого администратора?')

    if (!confirm(confirmMessage)) {
      return
    }

    setIsDeletingRestoring(true)

    try {
      // PATCH /api/admins/{adminId}/permissions with all permissions including deleted field
      const requestBody = {
        clientManagementEnabled: permissions.clientManagementEnabled,
        reportsEnabled: permissions.reportsEnabled,
        transactionsEnabled: permissions.transactionsEnabled,
        administrationEnabled: permissions.administrationEnabled,
        deleted: !isDeleted
      }

      console.log(`${action} admin request body:`, requestBody)

      const res = await apiFetch(`admins/${adminId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const responseData = await res.json()

      console.log(`${action} admin response:`, responseData)

      if (!res.ok) {
        alert(responseData.message || `Ошибка при ${action === 'delete' ? 'удалении' : 'восстановлении'} админа`)
        return
      }

      const successMessage = isDeleted
        ? (t('adminRestored') || 'Администратор успешно восстановлен')
        : (t('adminDeleted') || 'Администратор успешно удален')

      alert(successMessage)

      // Update local state from server response
      if (responseData.success && responseData.data) {
        const adminData = responseData.data
        setAdmin(prev => ({ ...prev, deleted: adminData.deleted || false }))
        setPermissions({
          clientManagementEnabled: adminData.clientManagementEnabled || false,
          reportsEnabled: adminData.reportsEnabled || false,
          transactionsEnabled: adminData.transactionsEnabled || false,
          administrationEnabled: adminData.administrationEnabled || false,
          deleted: adminData.deleted || false
        })
      }

      // Navigate back if deleted
      if (!isDeleted) {
        setTimeout(() => navigate('/admins'), 1000)
      }
    } catch (err) {
      console.error(`${action} admin error:`, err)
      alert(t('networkError') || 'Сетевая ошибка')
    } finally {
      setIsDeletingRestoring(false)
    }
  }

  // Check if current admin can edit this admin
  const currentAdminId = localStorage.getItem('adminId')
  const canEdit = isSuperAdmin || (currentAdminId && currentAdminId === adminId)

  return (
    <div className="client-details-container">
      <div className="client-nav">
        <button className="back-button" onClick={() => navigate('/admins')}>
          <ChevronLeft size={16} />
          {t('back') || 'Назад'}
        </button>
        <div className="breadcrumb">{t('admins') || 'Администраторы'} / {editedAdmin.name}</div>
      </div>

      <div className="client-content">
        <div className="client-info-panel">
          <div className="client-data-section">
            <div className="section-subtitle">{t('administratorData') || 'Данные администратора'}</div>

            <div className="data-row">
              <div className="data-label">{t('name') || 'Имя'}</div>
              <div className="data-value">{editedAdmin.name}</div>
            </div>

            <div className="data-row">
              <div className="data-label">{t('surname') || 'Фамилия'}</div>
              <div className="data-value">{editedAdmin.surname}</div>
            </div>

            <div className="data-row">
              <div className="data-label">{t('email') || 'Почта'}</div>
              {isEditing ? (
                <input
                  value={editedAdmin.email}
                  onChange={(e) => setEditedAdmin(s => ({ ...s, email: e.target.value }))}
                  className="data-value"
                  style={{ border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '0.5rem' }}
                />
              ) : (
                <div className="data-value">{editedAdmin.email}</div>
              )}
            </div>

            <div className="data-row">
              <div className="data-label">{t('phone') || 'Телефон'}</div>
              {isEditing ? (
                <input
                  value={editedAdmin.phone}
                  onChange={(e) => setEditedAdmin(s => ({ ...s, phone: e.target.value }))}
                  className="data-value"
                  style={{ border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '0.5rem' }}
                />
              ) : (
                <div className="data-value">{editedAdmin.phone}</div>
              )}
            </div>

            <div className="data-row">
              <div className="data-label">{t('password') || 'Пароль'}</div>
              <div className="data-value">••••••••</div>
            </div>

            {canEdit && (
              <button
                className="btn-edit"
                onClick={() => isEditing ? handleSaveAdmin() : setIsEditing(true)}
                disabled={isSavingAdmin}
              >
                <Edit size={16} />
                {isSavingAdmin
                  ? (t('saving') || 'Сохранение...')
                  : isEditing
                    ? (t('save') || 'Сохранить')
                    : (t('edit') || 'Редактировать')
                }
              </button>
            )}
          </div>

          {isSuperAdmin && (
            <button
              className={`btn-block ${(admin.deleted || permissions.deleted) ? 'btn-restore-admin' : 'btn-delete-admin'}`}
              onClick={handleDeleteRestore}
              disabled={isDeletingRestoring}
            >
              {(admin.deleted || permissions.deleted) ? (
                <>
                  <RotateCcw size={16} />
                  {t('restoreAdministrator') || 'Восстановить администратора'}
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  {t('deleteAdministrator') || 'Удалить администратора'}
                </>
              )}
            </button>
          )}
        </div>

        <div className="client-stats-section">
          <div className="section-subtitle">{t('modulesAccess') || 'Доступы к модулям'}</div>
          {isLoadingPermissions ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              {t('loading') || 'Загрузка...'}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <AccessItem
                icon={<UsersIcon size={18} />}
                title={t('clients') || 'Клиенты'}
                checked={permissions.clientManagementEnabled}
                onToggle={() => togglePermission('clientManagementEnabled')}
                disabled={!isSuperAdmin || isUpdatingPermission}
              />
              <AccessItem
                icon={<ArrowLeftRight size={18} />}
                title={t('transactions') || 'Транзакции'}
                checked={permissions.transactionsEnabled}
                onToggle={() => togglePermission('transactionsEnabled')}
                disabled={!isSuperAdmin || isUpdatingPermission}
              />
              <AccessItem
                icon={<BarChart size={18} />}
                title={t('reports') || 'Отчёты'}
                checked={permissions.reportsEnabled}
                onToggle={() => togglePermission('reportsEnabled')}
                disabled={!isSuperAdmin || isUpdatingPermission}
              />
              <AccessItem
                icon={<UserCog size={18} />}
                title={t('admins') || 'Администраторы'}
                checked={permissions.administrationEnabled}
                onToggle={() => togglePermission('administrationEnabled')}
                disabled={!isSuperAdmin || isUpdatingPermission}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AccessItem = ({ icon, title, checked, onToggle, disabled }) => {
  return (
    <div className="access-item" style={{ opacity: disabled ? 0.6 : 1 }}>
      <div className="access-item-content">
        <div className={`access-item-icon ${checked ? 'active' : 'inactive'}`}>
          {icon}
        </div>
        <div className="data-value">{title}</div>
      </div>
      <label className="custom-toggle">
        <input type="checkbox" checked={checked} onChange={onToggle} disabled={disabled} />
        <span className="toggle-slider"></span>
      </label>
    </div>
  )
}

export default AdminDetails
