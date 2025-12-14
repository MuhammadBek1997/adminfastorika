import { useState } from 'react'
import { useGlobalContext } from '../../context.js'
import { Search, ChevronRight, ChevronLeft, Check, Clock, ChevronDown, ArrowUpDown, ChevronsLeft } from 'lucide-react'
import '../../styles/Clients.css'
import { useNavigate } from 'react-router-dom'

const ClientsList = () => {
  const { t, users } = useGlobalContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [filterType, setFilterType] = useState('')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const navigate = useNavigate()
  
  // Static client data from screenshots
  const staticClients = [
    { id: 19, name: 'Иван Иванов', phone: '+998 98 765 43 21', email: 'example@gmail.com', registrationDate: '12 марта, 2025', verificationStatus: 'notVerified' },
    { id: 18, name: 'Анна Смирнова', phone: '+998 98 765 43 21', email: 'example@gmail.com', registrationDate: '15 апреля, 2025', verificationStatus: 'verified' },
    { id: 17, name: 'Петр Петров', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '22 мая, 2025', verificationStatus: 'verified' },
    { id: 16, name: 'Светлана Кузнецова', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '3 июня, 2025', verificationStatus: 'verified' },
    { id: 15, name: 'Дмитрий Волков', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '10 июля, 2025', verificationStatus: 'verified' },
    { id: 14, name: 'Елена Федорова', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '18 августа, 2025', verificationStatus: 'verified' },
    { id: 13, name: 'Елена Федорова', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '18 августа, 2025', verificationStatus: 'verified' },
    { id: 12, name: 'Елена Федорова', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '18 августа, 2025', verificationStatus: 'onWaiting' },
    { id: 11, name: 'Елена Федорова', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '18 августа, 2025', verificationStatus: 'verified' },
    { id: 10, name: 'Елена Федорова', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '18 августа, 2025', verificationStatus: 'verified' },
    { id: 9, name: 'Елена Федорова', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '18 августа, 2025', verificationStatus: 'verified' },
    { id: 8, name: 'Елена Федорова', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '18 августа, 2025', verificationStatus: 'onWaiting' },
    { id: 7, name: 'Иван Сидоров', phone: '+998 98 765 43 2121', email: 'example@gmail.com', registrationDate: '25 августа, 2025', verificationStatus: 'notVerified' },
  ]

  // Use static data if users array is empty or undefined
  const allUsers = users && users.length > 0 ? users : staticClients

  // Filter users based on search query
  const filteredUsers = allUsers.filter(user => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Filter type from top dropdown
    if (filterType) {
      if (filterType === 'Verified' && user.verificationStatus !== 'verified') return false
      if (filterType === 'NotVerified' && user.verificationStatus !== 'notVerified') return false
      if (filterType === 'OnWaiting' && user.verificationStatus !== 'onWaiting') return false
    }

    return true
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0

    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    // Handle ID sorting (numeric)
    if (sortConfig.key === 'id') {
      aValue = Number(aValue)
      bValue = Number(bValue)
    }

    // Handle verification sorting (status)
    if (sortConfig.key === 'verificationStatus') {
      const statusOrder = { verified: 2, onWaiting: 1, notVerified: 0 }
      aValue = statusOrder[a.verificationStatus] || 0
      bValue = statusOrder[b.verificationStatus] || 0
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem)

  const handleClientClick = (userId) => {
    navigate(`/clients/${userId}`)
  }

  const getVerificationBadge = (status) => {
    if (status === 'verified') {
      return (
        <span className="badge badge-verified">
          <Check size={12} strokeWidth={2.5} />
          {t('verified') || 'Верифицирован'}
        </span>
      )
    }
    if (status === 'onWaiting') {
      return (
        <span className="badge badge-on-waiting">
          <Clock size={12} strokeWidth={2.5} />
          {t('underReview') || 'На рассмотрении'}
        </span>
      )
    }
    return (
      <span className="badge badge-not-verified">
        
        {t('notVerified') || 'Не верифицирован'}
      </span>
    )
  }

  return (
    <div className="clients-list-container">
      {/* Search and Filters */}
      <div className="clients-header">
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
        <div className="header-actions">
          <div className="filter-dropdown">
            <button
              className="filter-button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              {filterType || t('personalData') || 'Персональные данные'}
              <ChevronDown size={16} />
            </button>
            {showFilterMenu && (
              <div className="dropdown-menu">
                <button onClick={() => { setFilterType(''); setShowFilterMenu(false) }} className="dropdown-item">
                  {t('all') || 'Все'}
                </button>
                <button onClick={() => { setFilterType('Verified'); setShowFilterMenu(false) }} className="dropdown-item">
                  {t('verified') || 'Верифицированные'}
                </button>
                <button onClick={() => { setFilterType('NotVerified'); setShowFilterMenu(false) }} className="dropdown-item">
                  {t('notVerified') || 'Не верифицированные'}
                </button>
                <button onClick={() => { setFilterType('OnWaiting'); setShowFilterMenu(false) }} className="dropdown-item">
                  {t('underReview') || 'На рассмотрении'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="clients-table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                <div className="th-content">
                  {t('id') || '№'}
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                <div className="th-content">
                  {t('name') || 'Имя'}
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>
                <div className="th-content">
                  {t('phone') || 'Телефон'}
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                <div className="th-content">
                  {t('email') || 'Почта'}
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => handleSort('registrationDate')} style={{ cursor: 'pointer' }}>
                <div className="th-content">
                  {t('registrationDate') || 'Дата регистрации'}
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th onClick={() => handleSort('verificationStatus')} style={{ cursor: 'pointer' }}>
                <div className="th-content">
                  {t('verification') || 'Верификация'}
                  <ArrowUpDown size={12} className="sort-icon" />
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id || index} onClick={() => handleClientClick(user.id)}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.registrationDate}</td>
                <td>{getVerificationBadge(user.verificationStatus)}</td>
                <td>
                  <ChevronRight size={18} className="row-arrow" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft size={16}/>
          {t('toStart') || 'В начало'}
        </button>
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
          {t('prev') || 'Назад'}
        </button>

        <div className="pagination-pages">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

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
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          {t('next') || 'Следующая'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default ClientsList
