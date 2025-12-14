import { useState, useMemo } from 'react'
import { useGlobalContext } from '../../context.js'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChevronDown, Check, MinusCircleIcon, CircleDollarSignIcon, MessagesSquare, Clock } from 'lucide-react'
import '../../styles/Reports.css'

const TransactionsReport = () => {
  const { t, theme } = useGlobalContext()
  const [timeRange, setTimeRange] = useState('year')
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-06-01' })
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showDateRangeMenu, setShowDateRangeMenu] = useState(false)
  const [showTimeRangeMenu, setShowTimeRangeMenu] = useState(false)
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showFromMenu, setShowFromMenu] = useState(false)
  const [showToMenu, setShowToMenu] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedFrom, setSelectedFrom] = useState('')
  const [selectedTo, setSelectedTo] = useState('')

  // Mock data for Transactions report
  const transactionsData = useMemo(() => [
    { month: 'Jan', Sent: 520, Declined: 180, InProcess: 350, ToPay: 580, Support: 220 },
    { month: 'Feb', Sent: 610, Declined: 240, InProcess: 390, ToPay: 640, Support: 180 },
    { month: 'Mar', Sent: 580, Declined: 210, InProcess: 420, ToPay: 690, Support: 250 },
    { month: 'Apr', Sent: 720, Declined: 190, InProcess: 480, ToPay: 710, Support: 200 },
    { month: 'May', Sent: 850, Declined: 220, InProcess: 520, ToPay: 780, Support: 240 },
    { month: 'Jun', Sent: 920, Declined: 200, InProcess: 580, ToPay: 850, Support: 280 }
  ], [])

  // Calculate total transactions
  const totalTransactions = useMemo(() => {
    return transactionsData.reduce((sum, item) =>
      sum + item.Sent + item.Declined + item.InProcess + item.ToPay + item.Support, 0
    )
  }, [transactionsData])

  // Count by status
  const statusCounts = useMemo(() => {
    const counts = { Sent: 0, Declined: 0, InProcess: 0, ToPay: 0, Support: 0 }
    transactionsData.forEach(item => {
      counts.Sent += item.Sent
      counts.Declined += item.Declined
      counts.InProcess += item.InProcess
      counts.ToPay += item.ToPay
      counts.Support += item.Support
    })
    return counts
  }, [transactionsData])

  // Export functions
  const exportToExcel = () => {
    console.log('Exporting to Excel...')
  }

  const exportToCSV = () => {
    console.log('Exporting to CSV...')
  }

  // Chart colors based on theme
  const chartColors = theme === 'dark' ? {
    sent: '#10b981',
    declined: '#ef4444',
    inProcess: '#3b82f6',
    toPay: '#f59e0b',
    support: '#8b5cf6',
    grid: '#404040',
    text: '#ffffff'
  } : {
    sent: '#10b981',
    declined: '#ef4444',
    inProcess: '#3b82f6',
    toPay: '#f59e0b',
    support: '#8b5cf6',
    grid: '#e5e7eb',
    text: '#111827'
  }

  return (
    <div className="report-container">
      {/* Filters Row */}
      <div className="report-filters">
        {/* Time Range */}
        <div className="filter-group">
          <button onClick={() => setShowTimeRangeMenu(!showTimeRangeMenu)} className="filter-button">
            {timeRange === 'sixMonths' ? (t('forSixMonths') || 'За пол года') :
             timeRange === 'year' ? (t('forYear') || 'За год') :
             (t('forQuarter') || 'За квартал')}
            <ChevronDown size={14} />
          </button>
          {showTimeRangeMenu && (
            <div className="export-menu">
              <button onClick={() => { setTimeRange('sixMonths'); setShowTimeRangeMenu(false) }} className="export-menu-item">
                {t('forSixMonths') || 'За пол года'}
              </button>
              <button onClick={() => { setTimeRange('year'); setShowTimeRangeMenu(false) }} className="export-menu-item">
                {t('forYear') || 'За год'}
              </button>
              <button onClick={() => { setTimeRange('quarter'); setShowTimeRangeMenu(false) }} className="export-menu-item">
                {t('forQuarter') || 'За квартал'}
              </button>
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="filter-group">
          <button onClick={() => setShowDateRangeMenu(!showDateRangeMenu)} className="filter-button">
            {t('dateRange') || 'Диапазон'}
            <ChevronDown size={14} />
          </button>
          {showDateRangeMenu && (
            <div className="date-range-menu">
              <div className="date-range-inputs">
                <div>
                  <div className="date-range-label">{t('from') || 'От'}</div>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="filter-input"
                  />
                </div>
                <div>
                  <div className="date-range-label">{t('to') || 'До'}</div>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="filter-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Type */}
        <div className="filter-group">
          <button onClick={() => setShowTypeMenu(!showTypeMenu)} className="filter-button">
            {selectedType || t('type') || 'Тип...'}
            <ChevronDown size={14} />
          </button>
          {showTypeMenu && (
            <div className="export-menu">
              <button onClick={() => { setSelectedType(t('type.transfer') || 'Transfer'); setShowTypeMenu(false) }} className="export-menu-item">
                {t('type.transfer') || 'Transfer'}
              </button>
              <button onClick={() => { setSelectedType(t('type.exchange') || 'Exchange'); setShowTypeMenu(false) }} className="export-menu-item">
                {t('type.exchange') || 'Exchange'}
              </button>
              <button onClick={() => { setSelectedType(t('type.withdrawal') || 'Withdrawal'); setShowTypeMenu(false) }} className="export-menu-item">
                {t('type.withdrawal') || 'Withdrawal'}
              </button>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="filter-group">
          <button onClick={() => setShowStatusMenu(!showStatusMenu)} className="filter-button">
            {selectedStatus || t('status') || 'Статус'}
            <ChevronDown size={14} />
          </button>
          {showStatusMenu && (
            <div className="export-menu">
              <button onClick={() => { setSelectedStatus(t('delivered') || 'Доставлено'); setShowStatusMenu(false) }} className="export-menu-item">
                {t('delivered') || 'Доставлено'}
              </button>
              <button onClick={() => { setSelectedStatus(t('rejected') || 'Отклонено'); setShowStatusMenu(false) }} className="export-menu-item">
                {t('rejected') || 'Отклонено'}
              </button>
              <button onClick={() => { setSelectedStatus(t('inProcess') || 'В обработке'); setShowStatusMenu(false) }} className="export-menu-item">
                {t('inProcess') || 'В обработке'}
              </button>
              <button onClick={() => { setSelectedStatus(t('toPay') || 'К оплате'); setShowStatusMenu(false) }} className="export-menu-item">
                {t('toPay') || 'К оплате'}
              </button>
              <button onClick={() => { setSelectedStatus(t('support') || 'Поддержка'); setShowStatusMenu(false) }} className="export-menu-item">
                {t('support') || 'Поддержка'}
              </button>
            </div>
          )}
        </div>

        {/* From */}
        <div className="filter-group">
          <button onClick={() => setShowFromMenu(!showFromMenu)} className="filter-button">
            {selectedFrom || t('from') || 'Откуда'}
            <ChevronDown size={14} />
          </button>
          {showFromMenu && (
            <div className="export-menu">
              <button onClick={() => { setSelectedFrom(t('country.usa') || 'USA'); setShowFromMenu(false) }} className="export-menu-item">
                {t('country.usa') || 'USA'}
              </button>
              <button onClick={() => { setSelectedFrom(t('country.uzbekistan') || 'Uzbekistan'); setShowFromMenu(false) }} className="export-menu-item">
                {t('country.uzbekistan') || 'Uzbekistan'}
              </button>
              <button onClick={() => { setSelectedFrom(t('country.russia') || 'Russia'); setShowFromMenu(false) }} className="export-menu-item">
                {t('country.russia') || 'Russia'}
              </button>
            </div>
          )}
        </div>

        {/* To */}
        <div className="filter-group">
          <button onClick={() => setShowToMenu(!showToMenu)} className="filter-button">
            {selectedTo || t('to') || 'Куда'}
            <ChevronDown size={14} />
          </button>
          {showToMenu && (
            <div className="export-menu">
              <button onClick={() => { setSelectedTo(t('country.usa') || 'USA'); setShowToMenu(false) }} className="export-menu-item">
                {t('country.usa') || 'USA'}
              </button>
              <button onClick={() => { setSelectedTo(t('country.uzbekistan') || 'Uzbekistan'); setShowToMenu(false) }} className="export-menu-item">
                {t('country.uzbekistan') || 'Uzbekistan'}
              </button>
              <button onClick={() => { setSelectedTo(t('country.russia') || 'Russia'); setShowToMenu(false) }} className="export-menu-item">
                {t('country.russia') || 'Russia'}
              </button>
            </div>
          )}
        </div>

        <div className="filter-spacer"></div>

        {/* Download */}
        <div className="filter-group">
          <button onClick={() => setShowExportMenu(!showExportMenu)} className="filter-button">
            {t('download') || 'Скачать'}
            <ChevronDown size={14} />
          </button>
          {showExportMenu && (
            <div className="export-menu">
              <button onClick={() => { exportToExcel(); setShowExportMenu(false) }} className="export-menu-item">
                {t('export.excel') || 'Excel'}
              </button>
              <button onClick={() => { exportToCSV(); setShowExportMenu(false) }} className="export-menu-item">
                {t('export.csv') || 'CSV'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="status-cards">
        <div className="status-card">
          <div className="status-card-header">
            <div className="status-card-label">{t('delivered') || 'Доставлено'}</div>
            <div className="status-icon green">
              <Check size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="status-card-value green">{statusCounts.Sent.toLocaleString()}</div>
        </div>
        <div className="status-card">
          <div className="status-card-header">
            <div className="status-card-label">{t('rejected') || 'Отклонено'}</div>
            <div className="status-icon red">
              <MinusCircleIcon size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="status-card-value red">{statusCounts.Declined.toLocaleString()}</div>
        </div>
        <div className="status-card">
          <div className="status-card-header">
            <div className="status-card-label">{t('inProcess') || 'В обработке'}</div>
            <div className="status-icon blue">
              <Clock size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="status-card-value blue">{statusCounts.InProcess.toLocaleString()}</div>
        </div>
        <div className="status-card">
          <div className="status-card-header">
            <div className="status-card-label">{t('toPay') || 'К оплате'}</div>
            <div className="status-icon orange">
              <CircleDollarSignIcon size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="status-card-value orange">{statusCounts.ToPay.toLocaleString()}</div>
        </div>
        <div className="status-card">
          <div className="status-card-header">
            <div className="status-card-label">{t('support') || 'Поддержка'}</div>
            <div className="status-icon purple">
              <MessagesSquare size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="status-card-value purple">{statusCounts.Support.toLocaleString()}</div>
        </div>
      </div>

      {/* Total Transactions */}
      <div className="report-total">
        <div className="report-total-label">
          {t('totalTransactions') || 'Общее количество транзакций за 1 января 2025 - 1 июня 2025'}
        </div>
        <div className="report-total-value">{totalTransactions.toLocaleString()}</div>
      </div>

      {/* Chart */}
      <div className="report-chart">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={transactionsData}>
            <defs>
              <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.sent} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColors.sent} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDeclined" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.declined} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColors.declined} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInProcess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.inProcess} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColors.inProcess} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorToPay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.toPay} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColors.toPay} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSupport" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.support} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColors.support} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis
              dataKey="month"
              stroke={chartColors.text}
              tickFormatter={(m) => {
                const map = { Jan: t('month.jan') || 'Jan', Feb: t('month.feb') || 'Feb', Mar: t('month.mar') || 'Mar', Apr: t('month.apr') || 'Apr', May: t('month.may') || 'May', Jun: t('month.jun') || 'Jun' }
                return map[m] || m
              }}
            />
            <YAxis stroke={chartColors.text} />
            <Tooltip
              contentStyle={{
                background: theme === 'dark' ? '#202020' : '#ffffff',
                border: `1px solid ${chartColors.grid}`,
                borderRadius: '0.5rem',
                color: chartColors.text
              }}
            />
            <Legend />
            <Area name={t('delivered') || 'Delivered'} type="monotone" dataKey="Sent" stroke={chartColors.sent} fillOpacity={1} fill="url(#colorSent)" />
            <Area name={t('rejected') || 'Rejected'} type="monotone" dataKey="Declined" stroke={chartColors.declined} fillOpacity={1} fill="url(#colorDeclined)" />
            <Area name={t('inProcess') || 'In Process'} type="monotone" dataKey="InProcess" stroke={chartColors.inProcess} fillOpacity={1} fill="url(#colorInProcess)" />
            <Area name={t('toPay') || 'To Pay'} type="monotone" dataKey="ToPay" stroke={chartColors.toPay} fillOpacity={1} fill="url(#colorToPay)" />
            <Area name={t('support') || 'Support'} type="monotone" dataKey="Support" stroke={chartColors.support} fillOpacity={1} fill="url(#colorSupport)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TransactionsReport
