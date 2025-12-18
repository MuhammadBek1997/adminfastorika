import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context.js'
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, Calendar, Filter, ArrowUpDown, ChevronDown, Check, MinusCircle as MinusCircleIcon, Clock, CircleDollarSign as CircleDollarSignIcon, MessagesSquare } from 'lucide-react'
import '../../styles/Transactions.css'

const TransactionsList = () => {
  const { t } = useGlobalContext()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [dateFilter, setDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [directionFilter, setDirectionFilter] = useState('')
  const [showDateMenu, setShowDateMenu] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showDirectionMenu, setShowDirectionMenu] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Mock transactions data
  const staticTransactions = [
    {
      id: 'hwV12pamJA3A367kh',
      clientName: 'Ivan Ivanov',
      date: 'June 25, 2025',
      time: '14:50',
      transactionId: 'hwV12pamJA3A367kh',
      directionFrom: 'https://img.icons8.com/color/96/uzbekistan-circular.png',
      directionTo: 'https://img.icons8.com/color/96/russian-federation-circular.png',
      amountSent: '50 USD',
      amountReceived: '2580 RUB',
      status: 'delivered'
    },
    {
      id: 'hwV12pamJA3A367ki',
      clientName: 'Olga Romanova',
      date: 'June 25, 2025',
      time: '14:50',
      transactionId: 'hwV12pamJA3A367ki',
      directionFrom: 'https://img.icons8.com/color/96/uzbekistan-circular.png',
      directionTo: 'https://img.icons8.com/color/96/russian-federation-circular.png',
      amountSent: '50 USD',
      amountReceived: '2580 RUB',
      status: 'rejected'
    },
    {
      id: 'hwV12pamJA3A367kj',
      clientName: 'Nikolai Orlov',
      date: 'June 25, 2025',
      time: '14:50',
      transactionId: 'hwV12pamJA3A367kj',
      directionFrom: 'https://img.icons8.com/color/96/uzbekistan-circular.png',
      directionTo: 'https://img.icons8.com/color/96/russian-federation-circular.png',
      amountSent: '50 USD',
      amountReceived: '2580 RUB',
      status: 'inProcess'
    },
    {
      id: 'hwV12pamJA3A367kk',
      clientName: 'Irina Lebedeva',
      date: 'June 25, 2025',
      time: '14:50',
      transactionId: 'hwV12pamJA3A367kk',
      directionFrom: 'https://img.icons8.com/color/96/uzbekistan-circular.png',
      directionTo: 'https://img.icons8.com/color/96/russian-federation-circular.png',
      amountSent: '50 USD',
      amountReceived: '2580 RUB',
      status: 'toPay'
    },
    {
      id: 'hwV12pamJA3A367kl',
      clientName: 'Anna Fedorova',
      date: 'June 25, 2025',
      time: '14:50',
      transactionId: 'hwV12pamJA3A367kl',
      directionFrom: 'https://img.icons8.com/color/96/uzbekistan-circular.png',
      directionTo: 'https://img.icons8.com/color/96/russian-federation-circular.png',
      amountSent: '50 USD',
      amountReceived: '2580 RUB',
      status: 'support'
    },
    {
      id: 'hwV12pamJA3A367km',
      clientName: 'Maria Sidorova',
      date: 'June 25, 2025',
      time: '14:50',
      transactionId: 'hwV12pamJA3A367km',
      directionFrom: 'https://img.icons8.com/color/96/uzbekistan-circular.png',
      directionTo: 'https://img.icons8.com/color/96/russian-federation-circular.png',
      amountSent: '50 USD',
      amountReceived: '2580 RUB',
      status: 'delivered'
    },
    {
      id: 'hwV12pamJA3A367kn',
      clientName: 'Dmitry Kuznetsov',
      date: 'June 25, 2025',
      time: '14:50',
      transactionId: 'hwV12pamJA3A367kn',
      directionFrom: 'https://img.icons8.com/color/96/uzbekistan-circular.png',
      directionTo: 'https://img.icons8.com/color/96/russian-federation-circular.png',
      amountSent: '50 USD',
      amountReceived: '2580 RUB',
      status: 'rejected'
    },
    {
      id: 'hwV12pamJA3A367ko',
      clientName: 'Alexey Petrov',
      date: 'June 25, 2025',
      time: '14:50',
      transactionId: 'hwV12pamJA3A367ko',
      directionFrom: 'https://img.icons8.com/color/96/uzbekistan-circular.png',
      directionTo: 'https://img.icons8.com/color/96/russian-federation-circular.png',
      amountSent: '50 USD',
      amountReceived: '2580 RUB',
      status: 'inProcess'
    },
    {
      id: 'hwV12pamJA3A367kp',
      clientName: 'Sergey Vasiliev',
      date: 'June 25, 2025',
      time: '14:50',
      transactionId: 'hwV12pamJA3A367kp',
      directionFrom: 'https://img.icons8.com/color/96/uzbekistan-circular.png',
      directionTo: 'https://img.icons8.com/color/96/russian-federation-circular.png',
      amountSent: '50 USD',
      amountReceived: '2580 RUB',
      status: 'delivered'
    },
    {
      id: 'hwV12pamJA3A367kq',
      clientName: 'Elena Smirnova',
      date: 'June 25, 2025',
      time: '14:50',
      transactionId: 'hwV12pamJA3A367kq',
      directionFrom: 'https://img.icons8.com/color/96/uzbekistan-circular.png',
      directionTo: 'https://img.icons8.com/color/96/russian-federation-circular.png',
      amountSent: '50 USD',
      amountReceived: '2580 RUB',
      status: 'support'
    }
  ]

  // Filter transactions
  const filteredTransactions = staticTransactions.filter(transaction => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        transaction.clientName?.toLowerCase().includes(query) ||
        transaction.transactionId?.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Date filter
    if (dateFilter && transaction.date !== dateFilter) return false

    // Status filter
    if (statusFilter && transaction.status !== statusFilter) return false

    // Direction filter
    if (directionFilter && transaction.direction !== directionFilter) return false

    return true
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig.key) return 0

    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

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
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTransactions = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      delivered: { text: t('delivered') || 'Доставлено', className: 'status-delivered', icon: Check },
      rejected: { text: t('rejected') || 'Отклонено', className: 'status-rejected', icon: MinusCircleIcon },
      inProcess: { text: t('inProcess') || 'В обработке', className: 'status-inProcess', icon: Clock },
      support: { text: t('support') || 'Поддержка', className: 'status-support', icon: MessagesSquare },
      toPay: { text: t('toPay') || 'К оплате', className: 'status-toPay', icon: CircleDollarSignIcon }
    }
    const statusInfo = statusMap[status] || statusMap.delivered
    const Icon = statusInfo.icon
    return (
      <span className={`transaction-badge ${statusInfo.className}`}>
        <Icon size={14} />
        {statusInfo.text}
      </span>
    )
  }

  return (
    <div className="transactions-list-container">
      {/* Header with Search and Filters */}
      <div className="transactions-header">
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
          {/* Date Filter */}
          <div className="filter-dropdown">
            <button
              className="filter-button"
              onClick={() => {
                setShowDateMenu(!showDateMenu)
                setShowStatusMenu(false)
                setShowDirectionMenu(false)
              }}
            >
              <Calendar size={16} />
              {dateFilter || t('date') || 'Дата'}
              <ChevronDown size={16} />
            </button>
            {showDateMenu && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { setDateFilter(''); setShowDateMenu(false) }}>
                  {t('all') || 'Все'}
                </button>
                <button className="dropdown-item" onClick={() => { setDateFilter('June 25, 2025'); setShowDateMenu(false) }}>
                  June 25, 2025
                </button>
              </div>
            )}
          </div>

          {/* Direction Filter */}
          <div className="filter-dropdown">
            <button
              className="filter-button"
              onClick={() => {
                setShowDirectionMenu(!showDirectionMenu)
                setShowDateMenu(false)
                setShowStatusMenu(false)
              }}
            >
              <Filter size={16} />
              {directionFilter === 'sent' ? (t('sent') || 'Отправлено') :
               directionFilter === 'received' ? (t('received') || 'Получено') :
               (t('direction') || 'Направление')}
              <ChevronDown size={16} />
            </button>
            {showDirectionMenu && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { setDirectionFilter(''); setShowDirectionMenu(false) }}>
                  {t('all') || 'Все'}
                </button>
                <button className="dropdown-item" onClick={() => { setDirectionFilter('sent'); setShowDirectionMenu(false) }}>
                  {t('sent') || 'Отправлено'}
                </button>
                <button className="dropdown-item" onClick={() => { setDirectionFilter('received'); setShowDirectionMenu(false) }}>
                  {t('received') || 'Получено'}
                </button>
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="filter-dropdown">
            <button
              className="filter-button"
              onClick={() => {
                setShowStatusMenu(!showStatusMenu)
                setShowDateMenu(false)
                setShowDirectionMenu(false)
              }}
            >
              <Filter size={16} />
              {statusFilter ? getStatusBadge(statusFilter) : (t('status') || 'Статус')}
              <ChevronDown size={16} />
            </button>
            {showStatusMenu && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { setStatusFilter(''); setShowStatusMenu(false) }}>
                  {t('all') || 'Все'}
                </button>
                <button className="dropdown-item" onClick={() => { setStatusFilter('delivered'); setShowStatusMenu(false) }}>
                  {t('delivered') || 'Доставлено'}
                </button>
                <button className="dropdown-item" onClick={() => { setStatusFilter('rejected'); setShowStatusMenu(false) }}>
                  {t('rejected') || 'Отклонено'}
                </button>
                <button className="dropdown-item" onClick={() => { setStatusFilter('inProcess'); setShowStatusMenu(false) }}>
                  {t('inProcess') || 'В обработке'}
                </button>
                <button className="dropdown-item" onClick={() => { setStatusFilter('support'); setShowStatusMenu(false) }}>
                  {t('support') || 'Поддержка'}
                </button>
                <button className="dropdown-item" onClick={() => { setStatusFilter('toPay'); setShowStatusMenu(false) }}>
                  {t('toPay') || 'К оплате'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>
                <div className="th-content">
                  <span>{t('client') || 'Клиент'}</span>
                  <ArrowUpDown
                    size={14}
                    className="sort-icon"
                    onClick={() => handleSort('clientName')}
                  />
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>{t('direction') || 'Направление'}</span>
                  <ArrowUpDown
                    size={14}
                    className="sort-icon"
                    onClick={() => handleSort('directionFrom')}
                  />
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>{t('dateTransactionId') || 'Дата / ID транзакции'}</span>
                  <ArrowUpDown
                    size={14}
                    className="sort-icon"
                    onClick={() => handleSort('date')}
                  />
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>{t('sentReceived') || 'Отправлено / Получено'}</span>
                  <ArrowUpDown
                    size={14}
                    className="sort-icon"
                    onClick={() => handleSort('amountSent')}
                  />
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>{t('status') || 'Статус'}</span>
                  <ArrowUpDown
                    size={14}
                    className="sort-icon"
                    onClick={() => handleSort('status')}
                  />
                </div>
              </th>
              <th style={{ width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                onClick={() => navigate(`/transactions/${transaction.id}`)}
              >
                <td>
                  <div className="client-cell">
                    <span className="client-name">{transaction.clientName}</span>
                  </div>
                </td>
                <td>
                  <div className="direction-cell">
                    <img src={transaction.directionFrom} alt="from" className="flag-icon" />
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="arrow-icon">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <img src={transaction.directionTo} alt="to" className="flag-icon" />
                  </div>
                </td>
                <td>
                  <div className="date-id-cell">
                    <div className="transaction-date">{transaction.date} в {transaction.time}</div>
                    <div className="transaction-id-small">{transaction.transactionId}</div>
                  </div>
                </td>
                <td>
                  <div className="amounts-cell">
                    <div className="amount-primary">{transaction.amountSent}</div>
                    <div className="amount-secondary">{transaction.amountReceived}</div>
                  </div>
                </td>
                <td>
                  {getStatusBadge(transaction.status)}
                </td>
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
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft size={16} />
          {t('toStart') || 'В начало'}
        </button>
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
          {t('back') || 'Назад'}
        </button>
        <div className="pagination-pages">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            )
          })}
        </div>
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {t('next') || 'Следующая'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default TransactionsList
