import { useState, useEffect } from 'react'
import { Search, ChevronRight, ChevronLeft, ChevronsLeft, ArrowUpDown, Plus, RotateCcw } from 'lucide-react'
import { useGlobalContext } from '../../context.js'
import '../../styles/Admins.css'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../api.js'

const AdminsList = () => {
  const { t } = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0) // Backend uses 0-based pages
  const [itemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '+998',
    password: '',
    dateOfBirth: '1997-03-16',
    countryId: 1
  })

  // Get admin role from localStorage
  const adminRole = localStorage.getItem('adminRole')
  const isSuperAdmin = adminRole === 'SUPER_ADMIN' || adminRole === 'SUPERADMIN'

  const navigate = useNavigate()

  // Load admins from backend
  const loadAdmins = async () => {
    setIsLoading(true)
    try {
      // Super admin can see deleted admins, so we send includeDeleted=true
      const includeDeleted = isSuperAdmin ? 'true' : 'false'
      const res = await apiFetch(`admins?page=${currentPage}&size=${itemsPerPage}&includeDeleted=${includeDeleted}`)
      const responseData = await res.json()

      console.log('Load admins response:', responseData)
      console.log('Response status:', res.status)
      console.log('Response ok:', res.ok)

      if (!res.ok) {
        alert(responseData.message || 'Ошибка при загрузке админов')
        return
      }

      // Handle different response structures
      let adminsData = []
      let totalPagesCount = 0

      if (responseData.success && responseData.data) {
        // Structure: { success: true, data: { content: [...], totalPages: N } }
        adminsData = responseData.data.content || []
        totalPagesCount = responseData.data.totalPages || 0
      } else if (responseData.content) {
        // Structure: { content: [...], totalPages: N }
        adminsData = responseData.content
        totalPagesCount = responseData.totalPages || 0
      } else if (Array.isArray(responseData)) {
        // Structure: [...]
        adminsData = responseData
        totalPagesCount = 1
      }

      console.log('Parsed admins data:', adminsData)
      console.log('Total pages:', totalPagesCount)

      setAdmins(adminsData)
      setTotalPages(totalPagesCount)
    } catch (err) {
      console.error('Load admins error:', err)
      alert(t('networkError') || 'Сетевая ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [currentPage])

  // Client-side filtering and sorting for display
  const filteredAdmins = admins.filter(a => {
    // Super admin sees all admins (deleted and active)
    // Regular admin only sees non-deleted admins
    if (a.deleted && !isSuperAdmin) return false

    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const fullName = `${a.name || ''} ${a.surname || ''}`.toLowerCase()
    return fullName.includes(q) || (a.email || '').toLowerCase().includes(q)
  })

  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    if (!sortConfig.key) return 0
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleRowClick = (admin) => {
    navigate(`/admins/${admin.id}`, { state: { admin } })
  }

  const handleRestoreAdmin = async (e, adminId) => {
    e.stopPropagation() // Prevent row click

    if (!confirm(t('confirmRestore') || 'Вы уверены, что хотите восстановить этого администратора?')) {
      return
    }

    try {
      const res = await apiFetch(`admins/${adminId}/restore`, {
        method: 'PATCH'
      })

      const responseData = await res.json()

      console.log('Restore admin response:', responseData)

      if (!res.ok) {
        alert(responseData.message || 'Ошибка при восстановлении админа')
        return
      }

      alert(t('adminRestored') || 'Администратор успешно восстановлен')
      loadAdmins()
    } catch (err) {
      console.error('Restore admin error:', err)
      alert(t('networkError') || 'Сетевая ошибка')
    }
  }

  const handleAddAdmin = async () => {
    // Validation
    if (!newAdmin.name.trim() || !newAdmin.surname.trim() || !newAdmin.email.trim() || !newAdmin.password.trim()) {
      alert(t('fillAllFields') || 'Заполните все обязательные поля')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await apiFetch('admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newAdmin.email.trim(),
          phone: newAdmin.phone.trim(),
          password: newAdmin.password,
          name: newAdmin.name.trim(),
          surname: newAdmin.surname.trim(),
          countryId: newAdmin.countryId,
          dateOfBirth: newAdmin.dateOfBirth
        })
      })

      const responseData = await res.json()

      console.log('Create admin response:', responseData)

      if (!res.ok) {
        alert(responseData.message || 'Ошибка при создании админа')
        return
      }

      alert(t('adminCreated') || `Админ успешно создан! Email: ${newAdmin.email}, Password: ${newAdmin.password}`)

      // Refresh admin list
      setShowAddModal(false)
      setNewAdmin({
        name: '',
        surname: '',
        email: '',
        phone: '+998',
        password: '',
        dateOfBirth: '1997-03-16',
        countryId: 1
      })

      // Reload admins list from API
      loadAdmins()

    } catch (err) {
      console.error('Create admin error:', err)
      alert(t('networkError') || 'Сетевая ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admins-list-container">
      <div className="admins-header">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder={t('search') || 'Поиск...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {isSuperAdmin && (
            <button className="addAdminBtn" onClick={() => setShowAddModal(true)}>
              {t('add') || 'Добавить'}
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="admins-table">
        <table>
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('name')} 
              >
                <div className="th-content">
                  {t('name') || 'Имя'}
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('email')} 
              >
                <div className="th-content">
                  {t('email') || 'Почта'}
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th style={{ width: isSuperAdmin ? '120px' : '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                  {t('loading') || 'Загрузка...'}
                </td>
              </tr>
            ) : sortedAdmins.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                  {t('noData') || 'Нет данных'}
                </td>
              </tr>
            ) : (
              sortedAdmins.map((a, idx) => (
                <tr
                  key={`${a.id}-${idx}`}
                  onClick={() => handleRowClick(a)}
                  style={{
                    opacity: a.deleted ? 0.6 : 1,
                    backgroundColor: a.deleted ? 'var(--bg-secondary)' : 'transparent'
                  }}
                >
                  <td>
                    {a.name} {a.surname}
                    {a.deleted && <span style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>(deleted)</span>}
                  </td>
                  <td>{a.email}</td>
                  <td style={{ textAlign: 'right', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {a.deleted && isSuperAdmin && (
                      <button
                        className="btn-restore"
                        onClick={(e) => handleRestoreAdmin(e, a.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.875rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer'
                        }}
                        title={t('restore') || 'Восстановить'}
                      >
                        <RotateCcw size={14} />
                        {t('restore') || 'Восстановить'}
                      </button>
                    )}
                    {!a.deleted && <ChevronRight size={18} className="row-arrow" />}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(0)}
          disabled={currentPage === 0}
        >
          <ChevronsLeft size={16} />
          {t('toStart') || 'В начало'}
        </button>
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={16} />
          {t('prev') || 'Назад'}
        </button>
        <div className="pagination-pages">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) pageNum = i
            else if (currentPage <= 2) pageNum = i
            else if (currentPage >= totalPages - 3) pageNum = totalPages - 5 + i
            else pageNum = currentPage - 2 + i
            return (
              <button
                key={pageNum}
                className={`pagination-page ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum + 1}
              </button>
            )
          })}
        </div>
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
        >
          {t('next') || 'Следующая'}
          <ChevronRight size={16} />
        </button>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">{t('addAdministrator') || 'Добавить администратора'}</h3>
            <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            <div className="form-grid">
              <div>
                <label className="form-label">{t('name') || 'Имя'}</label>
                <input
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin(s => ({ ...s, name: e.target.value }))}
                  className="form-input"
                  placeholder="Maximus"
                />
              </div>
              <div>
                <label className="form-label">{t('surname') || 'Фамилия'}</label>
                <input
                  value={newAdmin.surname}
                  onChange={(e) => setNewAdmin(s => ({ ...s, surname: e.target.value }))}
                  className="form-input"
                  placeholder="Strange"
                />
              </div>
              <div className="full">
                <label className="form-label">{t('email') || 'Почта'}</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin(s => ({ ...s, email: e.target.value }))}
                  className="form-input"
                  placeholder="lordallplay@gmail.com"
                />
              </div>
              <div className="full">
                <label className="form-label">{t('phone') || 'Номер телефона'}</label>
                <input
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin(s => ({ ...s, phone: e.target.value }))}
                  className="form-input"
                  placeholder="+998990972472"
                />
              </div>
              <div className="full">
                <label className="form-label">{t('password') || 'Пароль для входа'}</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin(s => ({ ...s, password: e.target.value }))}
                  className="form-input"
                  placeholder="Минимум 8 символов"
                />
              </div>
              <div className="full">
                <label className="form-label">{t('dateOfBirth') || 'Дата рождения'}</label>
                <input
                  type="date"
                  value={newAdmin.dateOfBirth}
                  onChange={(e) => setNewAdmin(s => ({ ...s, dateOfBirth: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>
                {t('cancel') || 'Отмена'}
              </button>
              <button className="btn-primary" onClick={handleAddAdmin} disabled={isSubmitting}>
                {isSubmitting ? (t('creating') || 'Создание...') : (t('add') || 'Добавить')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminsList
