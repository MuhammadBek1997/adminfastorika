import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGlobalContext } from '../../context.js'
import { ChevronLeft, Send, ArrowUpRight, ArrowDownRight, MoreVertical, Trash2, Copy } from 'lucide-react'
import '../../styles/Transactions.css'

const TransactionDetails = () => {
  const { t } = useGlobalContext()
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const [comment, setComment] = useState('')
  const [showSaveChanges, setShowSaveChanges] = useState(false)
  const [activeCommentMenu, setActiveCommentMenu] = useState(null)

  // Mock transaction data - replace with actual data fetch
  const transaction = {
    id: transactionId,
    status: 'delivered', // delivered, rejected, inProcess, support, toPay
    date: '8 июня, 2025 в 14:45',
    transactionId: '8 июня, 2025 в 14:45',
    isUserRemoved: false,
    transferAmount: 35000,
    transferCurrency: 'RUB',
    exchangeRate: 0.012546001,
    receivedAmount: 400,
    receivedCurrency: 'USD',
    externalTransactionId: 'no234-jfrhg290390r88df-diwevl24...',
    method: 'Panacea',
    senderCountry: 'Соединенные Штаты',
    senderCurrency: 'USD',
    sender: {
      name: 'Пастерников Валерий',
      bank: 'Panacea',
      account: '777567843467'
    },
    recipient: {
      name: 'Пастерников Валерий',
      bank: 'Spencer Callahan-Rose',
      account: '7775678434677'
    },
    recipientCountry: 'Россия',
    receivingBank: {
      name: 'Citibank N.A.',
      account: 'CITIUS33XXX'
    },
    paymentOperations: {
      payIn: 400,
      payOut: 397,
      commission: 3
    },
    user: {
      name: 'Пастерников Валерий',
      verification: 'Верифицирован',
      username: 'UHDhuf32B4rguaq0',
      country: 'Россия',
      email: 'example@gmail.com',
      phone: '+7 800 323 02 84',
      dateOfBirth: '12 марта, 1993',
      registrationDate: '8 августа, 2025'
    },
    comments: [
      {
        id: 1,
        user: 'UserName',
        date: '12 фев. 2024 - 17:00',
        text: 'Разнообразный и богатый опыт постоянный количественный рост и сфера нашей активности представляет собой',
        canDelete: true
      },
      {
        id: 2,
        user: 'UserName',
        date: '12 фев. 2024 - 17:00',
        text: 'Разнообразный и богатый опыт постоянный количественный рост и сфера нашей активности представляет собой'
      }
    ]
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      delivered: { text: t('delivered') || 'Доставлено', className: 'status-delivered' },
      rejected: { text: t('rejected') || 'Отклонено', className: 'status-rejected' },
      inProcess: { text: t('inProcess') || 'В обработке', className: 'status-inProcess' },
      support: { text: t('support') || 'Поддержка', className: 'status-support' },
      toPay: { text: t('toPay') || 'К оплате', className: 'status-toPay' }
    }
    return statusMap[status] || statusMap.delivered
  }

  const statusInfo = getStatusInfo(transaction.status)

  const handleSendComment = () => {
    if (comment.trim()) {
      // Send comment logic here
      setComment('')
    }
  }

  return (
    <div className="transaction-details-container">
      {/* Navigation */}
      <div className="transaction-nav">
        <button className="back-button" onClick={() => navigate('/transactions')}>
          <ChevronLeft size={18} />
          {t('back') || 'Назад'}
        </button>
        <div className="breadcrumb">
          {t('transactions') || 'Транзакции'} / ID {transaction.id}
        </div>
      </div>

      {/* Main Content */}
      <div className="transaction-content">
        {/* Left Column - Transaction Details and Comments */}
        <div className="transaction-left-column">
          {/* Transaction Info Section */}
          <div className="transaction-info-section">
            <h3 className="section-subtitle">{t('transactionDetails') || 'Детали транзакции'}</h3>

            {showSaveChanges && (
              <div className="save-changes-banner">
                <span>{t('saveChanges') || 'Сохраните изменения'}</span>
                <div className="save-changes-actions">
                  <button className="btn-cancel-changes" onClick={() => setShowSaveChanges(false)}>
                    {t('cancel') || 'Отменить'}
                  </button>
                  <button className="btn-save-changes">
                    {t('save') || 'Сохранить'}
                  </button>
                </div>
              </div>
            )}

            <div className="transaction-info-grid">
              {/* Left Column */}
              <div className="transaction-info-column">
                <div className="detail-row">
                  <div className="detail-label">{t('status') || 'Статус'}</div>
                  <div className="detail-value">
                    <select className={`status-select ${statusInfo.className}`} defaultValue={transaction.status}>
                      <option value="delivered">{t('delivered') || 'Доставлено'}</option>
                      <option value="rejected">{t('rejected') || 'Отклонено'}</option>
                      <option value="inProcess">{t('inProcess') || 'В обработке'}</option>
                      <option value="support">{t('support') || 'Поддержка'}</option>
                      <option value="toPay">{t('toPay') || 'К оплате'}</option>
                    </select>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('transactionId') || 'ID транзакции'}</div>
                  <div className="detail-value detail-value-with-copy">
                    {transaction.transactionId}
                    <button className="copy-btn" title="Copy">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="detail-divider"></div>

                <div className="detail-row">
                  <div className="detail-label">{t('transferAmount') || 'Сумма перевода'}</div>
                  <div className="detail-value detail-amount">
                    <span className="amount-value">{transaction.transferAmount.toLocaleString()}</span>
                    <span className="amount-currency">{transaction.transferCurrency}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('receivedAmount') || 'Сумма к получению'}</div>
                  <div className="detail-value detail-amount">
                    <span className="amount-value">{transaction.receivedAmount}</span>
                    <span className="amount-currency">{transaction.receivedCurrency}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('exchangeRate') || 'Курс обмена (1 RUB)'}</div>
                  <div className="detail-value detail-amount">
                    <span className="amount-value">{transaction.exchangeRate}</span>
                    <span className="amount-currency">{transaction.receivedCurrency}</span>
                  </div>
                </div>

                <div className="detail-divider"></div>

                <div className="detail-row">
                  <div className="detail-label">{t('externalTransactionId') || 'ID внешней транзакции'}</div>
                  <div className="detail-value detail-value-with-copy">
                    {transaction.externalTransactionId}
                    <button className="copy-btn" title="Copy">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('method') || 'Способ оплаты'}</div>
                  <div className="detail-value">{transaction.method}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('provider') || 'Провайдер'}</div>
                  <div className="detail-value">{transaction.method}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('senderCurrency') || 'Валюта получателя'}</div>
                  <div className="detail-value">{transaction.senderCurrency}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('sender') || 'Отправитель'}</div>
                  <div className="detail-value">{transaction.sender.name}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('senderBank') || 'Название банка'}</div>
                  <div className="detail-value">{transaction.sender.bank}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('senderAccount') || 'Номер счёта'}</div>
                  <div className="detail-value">{transaction.sender.account}</div>
                </div>
              </div>

              {/* Right Column */}
              <div className="transaction-info-column">
                <div className="detail-row">
                  <div className="detail-label">{t('date') || 'Дата'}</div>
                  <div className="detail-value">{transaction.date}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('userRemoved') || 'Транзакция удалена пользователем?'}</div>
                  <div className="detail-value">{transaction.isUserRemoved ? t('yes') || 'Да' : t('no') || 'Нет'}</div>
                </div>

                <div className="detail-divider"></div>

                <div className="detail-row">
                  <div className="detail-label">{t('recipientCurrency') || 'Получатель'}</div>
                  <div className="detail-value">{transaction.recipient.name}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('recipientBank') || 'Название банка'}</div>
                  <div className="detail-value">{transaction.recipient.bank}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('recipientAccount') || 'Номер счёта'}</div>
                  <div className="detail-value">{transaction.recipient.account}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('receivingBank') || 'Получающий банк'}</div>
                  <div className="detail-value">{transaction.receivingBank.name}</div>
                </div>

                <div className="detail-row">
                  <div className="detail-label">{t('receivingBankAccount') || 'Название банка'}</div>
                  <div className="detail-value">{transaction.receivingBank.account}</div>
                </div>
              </div>
            </div>
          </div>

          
        </div>

        {/* Right Sidebar - Payment Operations and User Data */}
        <div className="transaction-right-sidebar">
          {/* Payment Operations Section */}
          <div className="payment-operations-section">
            <h3 className="section-subtitle">{t('paymentOperations') || 'Платежные операции'}</h3>

            <div className="payment-cards">
              <div className="payment-card pay-in">
                <div className="payment-card-header">
                  <span className="payment-label">Pay In</span>
                  <div className="payment-icon green">
                    <ArrowDownRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="payment-amount">${transaction.paymentOperations.payIn}</div>
              </div>

              <div className="payment-card pay-out">
                <div className="payment-card-header">
                  <span className="payment-label">Pay Out</span>
                  <div className="payment-icon red">
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="payment-amount">${transaction.paymentOperations.payOut}</div>
              </div>

              <div className="payment-card commission">
                <div className="payment-card-header">
                  <span className="payment-label">{t('commission') || 'Маржа'}</span>
                  <div className="payment-icon blue">
                    <span className="commission-symbol">$</span>
                  </div>
                </div>
                <div className="payment-amount">${transaction.paymentOperations.commission}</div>
              </div>
            </div>
          </div>

          {/* User Data Section */}
          <div className="user-data-section">
            <h3 className="section-subtitle">{t('userData') || 'Данные пользователя'}</h3>

            <div className="detail-row">
              <div className="detail-label">{t('name') || 'Имя'}</div>
              <div className="detail-value">{transaction.user.name}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">{t('verification') || 'Верификация'}</div>
              <div className="detail-value verification-verified">{transaction.user.verification}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">{t('username') || 'ID пользователя'}</div>
              <div className="detail-value">{transaction.user.username}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">{t('country') || 'Страна'}</div>
              <div className="detail-value">{transaction.user.country}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">{t('email') || 'Почта'}</div>
              <div className="detail-value">{transaction.user.email}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">{t('phone') || 'Телефон'}</div>
              <div className="detail-value">{transaction.user.phone}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">{t('dateOfBirth') || 'Дата рождения'}</div>
              <div className="detail-value">{transaction.user.dateOfBirth}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">{t('registrationDate') || 'Дата регистрации'}</div>
              <div className="detail-value">{transaction.user.registrationDate}</div>
            </div>

            <button className="btn-view-client" onClick={() => navigate(`/clients/1`)}>
              {t('viewClient') || 'Перейти к клиенту'} →
            </button>
          </div>

          {/* Comments Section */}
          <div className="comments-section">
            <h3 className="section-subtitle">{t('comments') || 'Комментарии'}</h3>

            <div className="comments-list">
              {transaction.comments.map((commentItem) => (
                <div key={commentItem.id} className="comment-item">
                  <div className="comment-bubble">
                    <div className="comment-header">
                      <div className="comment-avatar">{commentItem.user.charAt(0)}</div>
                      <div className="comment-meta">
                        <div className="comment-user">{commentItem.user}</div>
                        <div className="comment-date">{commentItem.date}</div>
                      </div>
                      {commentItem.canDelete && (
                        <div className="comment-menu-wrapper">
                          <button
                            className="comment-menu-btn"
                            onClick={() => setActiveCommentMenu(activeCommentMenu === commentItem.id ? null : commentItem.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          {activeCommentMenu === commentItem.id && (
                            <div className="comment-dropdown-menu">
                              <button className="comment-dropdown-item delete">
                                <Trash2 size={14} />
                                {t('deleteComment') || 'Удалить комментарий'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="comment-text">{commentItem.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="comment-input-wrapper">
              <textarea
                className="comment-input"
                placeholder={t('enterText') || 'Введите текст...'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                className="btn-send-comment"
                onClick={handleSendComment}
                disabled={!comment.trim()}
              >
                {t('send') || 'Отправить'}
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetails
