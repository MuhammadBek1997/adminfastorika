import { useState } from 'react'
import { Search, ChevronRight, ChevronLeft, ChevronsLeft, ArrowUpDown, Plus } from 'lucide-react'
import { useGlobalContext } from '../../context.js'
import '../../styles/Admins.css'
import { useNavigate } from 'react-router-dom'

const AdminsList = () => {
  const { t } = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ firstName: '', lastName: '', email: '', phone: '+998', password: '' })

const navigate = useNavigate()

  const staticAdmins = [
    { id: 1, name: 'Иван Иванов', email: 'example@gmail.com' },
    { id: 2, name: 'Иван Иванов', email: 'example@gmail.com' },
    { id: 3, name: 'Мария Петрова', email: 'maria.petrova@mail.com' },
    { id: 4, name: 'Сергей Смирнов', email: 'sergey.smirnov@outlook.com' },
    { id: 5, name: 'Александр Кузнецов', email: 'alex.kuznetsov@yahoo.com' },
    { id: 6, name: 'Анна Васильева', email: 'anna.vasilieva@gmail.com' },
    { id: 7, name: 'Дмитрий Соколов', email: 'dmitry.sokolov@protonmail.com' },
    { id: 8, name: 'Елена Михайлова', email: 'elena.mikhaylova@icloud.com' },
    { id: 9, name: 'Николай Федоров', email: 'nikolai.fedorov@hotmail.com' },
    { id: 10, name: 'Ольга Романовская', email: 'olga.romanovskaya@live.com' },
    { id: 11, name: 'Толик Трофимов', email: 'tolik.trofimov@tutanota.com' },
    { id: 12, name: 'Светлана Григорьева', email: 'svetlana.grigorieva@aol.com' }
  ]

  const [admins, setAdmins] = useState(staticAdmins)

  const filteredAdmins = admins.filter(a => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
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

  const totalPages = Math.ceil(sortedAdmins.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAdmins = sortedAdmins.slice(indexOfFirstItem, indexOfLastItem)

  const handleRowClick = (admin) => {
    navigate(`/admins/${admin.id}`, { state: { admin } })
  }

  const handleAddAdmin = () => {
    const name = `${newAdmin.firstName.trim()} ${newAdmin.lastName.trim()}`.trim()
    if (!name || !newAdmin.email.trim()) return
    const nextId = admins.length ? Math.max(...admins.map(a => a.id)) + 1 : 1
    setAdmins(prev => ([...prev, { id: nextId, name, email: newAdmin.email.trim() }]))
    setShowAddModal(false)
    setNewAdmin({ firstName: '', lastName: '', email: '', phone: '+998', password: '' })
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
        <button className="addAdminBtn" onClick={() => setShowAddModal(true)}>
          {t('add') || 'Добавить'}
          <Plus size={16} />
        </button>
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
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {currentAdmins.map((a, idx) => (
              <tr 
                key={`${a.id}-${idx}`}
                onClick={() => handleRowClick(a)}
              >
                <td>{a.name}</td>
                <td>{a.email}</td>
                <td style={{ textAlign: 'right' }}>
                  <ChevronRight size={18} className="row-arrow" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft size={16} />
          {t('toStart') || 'В начало'}
        </button>
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
          {t('prev') || 'Назад'}
        </button>
        <div className="pagination-pages">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) pageNum = i + 1
            else if (currentPage <= 3) pageNum = i + 1
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
            else pageNum = currentPage - 2 + i
            return (
              <button
                key={pageNum}
                className={`pagination-page ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            )
          })}
        </div>
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          {t('next') || 'Следующая'}
          <ChevronRight size={16} />
        </button>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{t('addAdministrator') || 'Добавить администратора'}</h3>
            <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            <div className="form-grid">
              <div>
                <label className="form-label">{t('name') || 'Имя'}</label>
                <input 
                  value={newAdmin.firstName}
                  onChange={(e) => setNewAdmin(s => ({ ...s, firstName: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">{t('surname') || 'Фамилия'}</label>
                <input 
                  value={newAdmin.lastName}
                  onChange={(e) => setNewAdmin(s => ({ ...s, lastName: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="full">
                <label className="form-label">{t('email') || 'Почта'}</label>
                <input 
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin(s => ({ ...s, email: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="full">
                <label className="form-label">{t('phone') || 'Номер телефона'}</label>
                <input 
                  value={newAdmin.phone}
                  onChange={(e) => setNewAdmin(s => ({ ...s, phone: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div className="full">
                <label className="form-label">{t('password') || 'Пароль для входа'}</label>
                <input 
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin(s => ({ ...s, password: e.target.value }))}
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowAddModal(false)}>
                {t('cancel') || 'Отмена'}
              </button>
              <button className="btn-primary" onClick={handleAddAdmin}>
                {t('add') || 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminsList
