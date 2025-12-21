import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGlobalContext } from '../../context.js'
import { ChevronLeft, Search, Edit, CreditCard, Check, XCircle, Clock, DollarSign, MessageCircle, MinusCircleIcon, CircleDollarSignIcon, MessagesSquare, MoreVertical, Trash2 } from 'lucide-react'
import '../../styles/Clients.css'

const ClientDetails = () => {
  const { t } = useGlobalContext()
  const navigate = useNavigate()
  const { clientId } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showUnblockModal, setShowUnblockModal] = useState(false)
  const [activeCardMenu, setActiveCardMenu] = useState(null)

  // Mock client data - replace with actual data fetch
  const client = {
    id: clientId,
    name: 'Пастернюков Валерий',
    verification: 'Верифицирован',
    username: 'UzNut92846pgq90',
    country: 'Россия',
    email: 'example@gmail.com',
    phone: '+7 800 323 02 84',
    dateOfBirth: '12 марта, 1993',
    registrationDate: '8 августа, 2025',
    isBlocked: false,
    statistics: {
      delivered: 847,
      rejected: 263,
      inProcess: 491,
      toPay: 738,
      support: 315
    },
    linkedCards: [
      { id: 1, number: '4532 1234 5678 9010', bank: 'Основная', type: 'visa' },
      { id: 2, number: '5500 1234 5678 9010', bank: 'Основная', type: 'mastercard' },
      { id: 3, number: '6011 1234 5678 9010', bank: 'Удалить карту', type: 'maestro', canDelete: true },
      { id: 4, number: '3714 4963 5388 431', bank: '', type: 'visa' }
    ]
  }

  // Mock transactions
  const transactions = [
    { id: 1, date: '25 июня, 2025 в 14:50', transactionId: 'hwV2pamJA3l57kh', amountUSD: '50 USD', amountRUB: '2580 RUB', status: 'delivered' },
    { id: 2, date: '25 июня, 2025 в 14:50', transactionId: 'hwV2pamJA3l57kh', amountUSD: '50 USD', amountRUB: '2580 RUB', status: 'rejected' },
    { id: 3, date: '25 июня, 2025 в 14:50', transactionId: 'hwV2pamJA3l57kh', amountUSD: '50 USD', amountRUB: '2580 RUB', status: 'inProcess' },
    { id: 4, date: '25 июня, 2025 в 14:50', transactionId: 'hwV2pamJA3l57kh', amountUSD: '50 USD', amountRUB: '2580 RUB', status: 'support' },
    { id: 5, date: '25 июня, 2025 в 14:50', transactionId: 'hwV2pamJA3l57kh', amountUSD: '50 USD', amountRUB: '2580 RUB', status: 'toPay' }
  ]

  const getStatusBadge = (status) => {
    const statusMap = {
      delivered: { text: t('delivered') || 'Доставлено', className: 'status-delivered' },
      rejected: { text: t('rejected') || 'Отклонено', className: 'status-rejected' },
      inProcess: { text: t('inProcess') || 'В обработке', className: 'status-in-process' },
      support: { text: t('support') || 'Поддержка', className: 'status-support' },
      toPay: { text: t('toPay') || 'К оплате', className: 'status-to-pay' }
    }
    const statusInfo = statusMap[status] || statusMap.delivered
    return <span className={`transaction-status ${statusInfo.className}`}>{statusInfo.text}</span>
  }

  const getCardIcon = () => {
    return <CreditCard size={20} />
  }

  return (
    <div className="client-details-container">
      {/* Navigation */}
      <div className="client-nav">
        <button className="back-button" onClick={() => navigate('/clients')}>
          <ChevronLeft size={18} />
          {t('back') || 'Назад'}
        </button>
        <div className="breadcrumb">
          {t('clients') || 'Клиенты'} / {t('client') || 'Пастернюков Валерий'}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="client-content">
        {/* Left Column - Client Info */}
        <div className="client-info-panel">
          {/* Alert if blocked */}
          {client.isBlocked && (
            <div className="alert alert-danger">
              <div className="alert-title">{t('clientBlocked') || 'Клиент заблокирован'}</div>
              <div className="alert-subtitle">{t('suspiciousActivity') || 'Причина: Мошенническая активность'}</div>
              <button className="btn-unblock" onClick={() => setShowUnblockModal(true)}>
                {t('unblock') || 'Разблокировать'}
              </button>
            </div>
          )}

          {/* Client Data */}
          <div className="client-data-section">
            <h3 className="section-subtitle">{t('userData') || 'Данные пользователя'}</h3>

            <div className="data-row">
              <div className="data-label">{t('name') || 'Имя'}</div>
              <div className="data-value">{client.name}</div>
            </div>

            <div className="data-row">
              <div className="data-label">{t('verification') || 'Верификация'}</div>
              <div className="data-value verification-verified">{client.verification}</div>
            </div>

            <div className="data-row">
              <div className="data-label">{t('username') || 'ID пользователя'}</div>
              <div className="data-value">{client.username}</div>
            </div>

            <div className="data-row">
              <div className="data-label">{t('country') || 'Страна'}</div>
              <div className="data-value">{client.country}</div>
            </div>

            <div className="data-row">
              <div className="data-label">{t('email') || 'Почта'}</div>
              <div className="data-value">{client.email}</div>
            </div>

            <div className="data-row">
              <div className="data-label">{t('phone') || 'Телефон'}</div>
              <div className="data-value">{client.phone}</div>
            </div>

            <div className="data-row">
              <div className="data-label">{t('dateOfBirth') || 'Дата рождения'}</div>
              <div className="data-value">{client.dateOfBirth}</div>
            </div>

            <div className="data-row">
              <div className="data-label">{t('registrationDate') || 'Дата регистрации'}</div>
              <div className="data-value">{client.registrationDate}</div>
            </div>

            <button className="btn-edit" onClick={() => setShowEditModal(true)}>
              <Edit size={16} />
              {t('edit') || 'Редактировать'}
            </button>
          </div>

          {/* Statistics */}
          {/* <div className="client-stats-section">
            <h3 className="section-subtitle">{t('statusStatistics') || 'Статистика по статусам'}</h3>

            <div className="stat-row">
              <div className="stat-label">{t('delivered') || 'Доставлено'}</div>
              <div className="stat-value stat-delivered">
                <Check size={16} />
                {client.statistics.delivered}
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-label">{t('rejected') || 'Отклонено'}</div>
              <div className="stat-value stat-rejected">
                <XCircle size={16} />
                {client.statistics.rejected}
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-label">{t('inProcess') || 'В обработке'}</div>
              <div className="stat-value stat-in-process">
                <Clock size={16} />
                {client.statistics.inProcess}
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-label">{t('toPay') || 'К оплате'}</div>
              <div className="stat-value stat-to-pay">
                <DollarSign size={16} />
                {client.statistics.toPay}
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-label">{t('support') || 'Поддержка'}</div>
              <div className="stat-value stat-support">
                <MessageCircle size={16} />
                {client.statistics.support}
              </div>
            </div>
          </div> */}
          <div className="status-cards">
            <div className="status-card">
              <div className="status-card-header">
                <div className="status-card-label">{t('delivered') || 'Доставлено'}</div>
                <div className="client-status-icon green">
                  <Check size={16} strokeWidth={3} />
                </div>
              </div>
              <div className="status-card-value green">{client.statistics.delivered}</div>
            </div>
            <div className="status-card">
              <div className="status-card-header">
                <div className="status-card-label">{t('rejected') || 'Отклонено'}</div>
                <div className="client-status-icon red">
                  <MinusCircleIcon size={16} strokeWidth={3} />
                </div>
              </div>
              <div className="status-card-value red">{client.statistics.rejected}</div>
            </div>
            <div className="status-card">
              <div className="status-card-header">
                <div className="status-card-label">{t('inProcess') || 'В обработке'}</div>
                <div className="client-status-icon blue">
                  <Clock size={16} strokeWidth={3} />
                </div>
              </div>
              <div className="status-card-value blue">{client.statistics.inProcess}</div>
            </div>
            <div className="status-card">
              <div className="status-card-header">
                <div className="status-card-label">{t('toPay') || 'К оплате'}</div>
                <div className="client-status-icon orange">
                  <CircleDollarSignIcon size={16} strokeWidth={3} />
                </div>
              </div>
              <div className="status-card-value orange">{client.statistics.toPay}</div>
            </div>
            <div className="status-card">
              <div className="status-card-header">
                <div className="status-card-label">{t('support') || 'Поддержка'}</div>
                <div className="client-status-icon purple">
                  <MessagesSquare size={16} strokeWidth={3} />
                </div>
              </div>
              <div className="status-card-value purple">{client.statistics.support}</div>
            </div>
          </div>

          {/* Linked Cards */}
          <div className="client-cards-section">
            <h3 className="section-subtitle">{t('linkedCards') || 'Привязанные карты'}</h3>

            {client.linkedCards.map(card => (
              <div key={card.id} className="card-item">
                <div className="card-icon">
                  {getCardIcon(card.type)}
                </div>
                <div className="card-details">
                  <div className="card-number">{card.number}</div>
                  {card.bank && <div className="card-bank">{card.bank}</div>}
                </div>
                <div className="card-menu-wrapper">
                  <button
                    className="card-menu-btn"
                    onClick={() => setActiveCardMenu(activeCardMenu === card.id ? null : card.id)}
                  >
                    <MoreVertical size={18} />
                  </button>
                  {activeCardMenu === card.id && (
                    <div className="card-dropdown-menu">
                      <button className="card-dropdown-item delete">
                        <Trash2 size={14} />
                        {t('deleteCard') || 'Удалить карту'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Block Button */}
          {!client.isBlocked && (
            <button className="btn-block" onClick={() => setShowBlockModal(true)}>
              {t('blockClient') || 'Заблокировать клиента'}
            </button>
          )}
        </div>

        {/* Right Column - Transactions */}
        <div className="client-transactions-panel">
          <h3 className="section-subtitle">{t('transactionHistory') || 'История транзакций'}</h3>

          {/* Search */}
          <div className="transaction-search">
            <Search size={18} />
            <input
              type="text"
              placeholder={t('search') || 'Поиск...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Filters */}
          <div className="transaction-filters">
            <div className="filter-label">{t('dateTransactionId') || 'Дата / ID транзакции'}</div>
            <div className="filter-label">{t('sentReceived') || 'Отправлено / Получено'}</div>
            <div className="filter-label">{t('status') || 'Статус'}</div>
          </div>

          {/* Transaction List */}
          <div className="transactions-list">
            {transactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-date-id">
                  <div className="transaction-date">{transaction.date}</div>
                  <div className="transaction-id">{transaction.transactionId}</div>
                </div>
                <div className="transaction-amounts">
                  <div className="transaction-amount-usd">{transaction.amountUSD}</div>
                  <div className="transaction-amount-rub">{transaction.amountRUB}</div>
                </div>
                <div className="transaction-status-col">
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="transaction-pagination">
            <button className="pagination-btn">{t('toStart') || 'В начало'}</button>
            <button className="pagination-btn">
              <ChevronLeft size={16} />
              {t('back') || 'Назад'}
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">{t('next') || 'Следующая'}</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('editClientData') || 'Редактировать данные клиента'}</h3>
            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            {/* Edit form fields here */}
          </div>
        </div>
      )}

      {showBlockModal && (
        <div className="modal-overlay" onClick={() => setShowBlockModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('blockClient') || 'Заблокировать клиента'}</h3>
            <p>{t('blockClientConfirm') || 'Укажите причину блокировки'}</p>
            <button className="modal-close" onClick={() => setShowBlockModal(false)}>×</button>
            {/* Block form here */}
          </div>
        </div>
      )}

      {showUnblockModal && (
        <div className="modal-overlay" onClick={() => setShowUnblockModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('unblockClient') || 'Разблокировать'}</h3>
            <p>{t('unblockClientConfirm') || 'Разблокировать этого пользователя?'}</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowUnblockModal(false)}>
                {t('cancel') || 'Отмена'}
              </button>
              <button className="btn-confirm">
                {t('unblock') || 'Разблокировать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientDetails
