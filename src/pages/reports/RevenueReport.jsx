import { useState, useMemo } from 'react'
import { useGlobalContext } from '../../context.js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronDown, TrendingUp, ArrowRightLeft, Percent, DollarSign, Receipt } from 'lucide-react'
import '../../styles/Reports.css'

const RevenueReport = () => {
  const { t, theme } = useGlobalContext()
  const [timeRange, setTimeRange] = useState('sixMonths')
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-06-01' })
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showDateRangeMenu, setShowDateRangeMenu] = useState(false)
  const [showTimeRangeMenu, setShowTimeRangeMenu] = useState(false)

  // Mock data for Revenue and Commissions
  const revenueData = useMemo(() => [
    { month: 'Jan', revenue: 28500 },
    { month: 'Feb', revenue: 34200 },
    { month: 'Mar', revenue: 38600 },
    { month: 'Apr', revenue: 52300 },
    { month: 'May', revenue: 61800 },
    { month: 'Jun', revenue: 75200 }
  ], [])

  const totalRevenue = useMemo(() =>
    revenueData.reduce((sum, item) => sum + item.revenue, 0)
  , [revenueData])

  // Mock data for top corridors and currency pairs
  const topCorridors = [
    { corridor: 'US → MX', volume: '$30,000', revenue: '$12,000', share: '36%' },
    { corridor: 'US → MX', volume: '$30,000', revenue: '$12,000', share: '36%' },
    { corridor: 'US → CA', volume: '$25,000', revenue: '$10,000', share: '40%' },
    { corridor: 'US → BR', volume: '$20,000', revenue: '$8,000', share: '30%' },
    { corridor: 'US → CL', volume: '$22,000', revenue: '$9,500', share: '35%' },
    { corridor: 'US → AR', volume: '$28,000', revenue: '$11,500', share: '41%' },
    { corridor: 'US → CO', volume: '$26,000', revenue: '$10,200', share: '39%' },
    { corridor: 'US → PE', volume: '$24,000', revenue: '$9,800', share: '38%' },
    { corridor: 'US → DO', volume: '$27,000', revenue: '$10,700', share: '37%' },
    { corridor: 'US → EC', volume: '$29,000', revenue: '$11,200', share: '42%' }
  ]

  const topCurrencyPairs = [
    { pair: 'USD/UZS', volume: '$30,000', spread: '$12,000', avgSpread: '0.4%' },
    { pair: 'USD/UZS', volume: '$30,000', spread: '$12,000', avgSpread: '0.4%' },
    { pair: 'EUR/UZS', volume: '€25,000', spread: '$10,500', avgSpread: '0.42%' },
    { pair: 'GBP/UZS', volume: '£20,000', spread: '$8,000', avgSpread: '0.39%' },
    { pair: 'JPY/UZS', volume: '¥4,000,000', spread: '$36,000', avgSpread: '0.45%' },
    { pair: 'AUD/UZS', volume: 'A$40,000', spread: '$27,000', avgSpread: '0.37%' },
    { pair: 'CAD/UZS', volume: 'C$35,000', spread: '$28,000', avgSpread: '0.38%' },
    { pair: 'CHF/UZS', volume: 'CHF30,000', spread: '$32,000', avgSpread: '0.41%' },
    { pair: 'CNY/UZS', volume: '¥200,000', spread: '$31,000', avgSpread: '0.43%' },
    { pair: 'INR/UZS', volume: '₹2,000,000', spread: '$24,000', avgSpread: '0.36%' }
  ]

  // Export functions
  const exportToExcel = () => {
    console.log('Exporting to Excel...')
  }

  const exportToCSV = () => {
    console.log('Exporting to CSV...')
  }

  // Chart colors based on theme
  const chartColors = theme === 'dark' ? {
    revenue: '#00D796',
    grid: '#404040',
    text: '#ffffff'
  } : {
    revenue: '#00D796',
    grid: '#e5e7eb',
    text: '#111827'
  }

  return (
    <div className="report-container">
      {/* Filters Row - Full Width */}
      <div className="report-filters">
        {/* Time Range Dropdown */}
        <div className="filter-group">
          <button onClick={() => setShowTimeRangeMenu(!showTimeRangeMenu)} className="filter-button">
            {timeRange === 'sixMonths' ? (t('forSixMonths') || 'За пол года') :
             (t('forYear') || 'За год')}
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
            </div>
          )}
        </div>

        {/* Date Range Dropdown */}
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

        {/* Spacer */}
        <div className="filter-spacer"></div>

        {/* Export Dropdown */}
        <div className="filter-group">
          <button onClick={() => setShowExportMenu(!showExportMenu)} className="filter-button">
            {t('download') || 'Скачать'}
            <ChevronDown size={14} />
          </button>
          {showExportMenu && (
            <div className="export-menu">
              <button onClick={() => { exportToExcel(); setShowExportMenu(false) }} className="export-menu-item">
                Excel
              </button>
              <button onClick={() => { exportToCSV(); setShowExportMenu(false) }} className="export-menu-item">
                CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Cards - Full Width Grid */}
      <div className="status-cards">
        <div className="status-card">
          <div className="status-card-header">
            <div className="status-card-label">
              {t('totalRevenue') || 'Общая выручка'}
            </div>
            <div className="status-icon green">
              <TrendingUp size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="status-card-value green">
            ${totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="status-card">
          <div className="status-card-header">
            <div className="status-card-label">
              {t('totalInTransfers') || 'Всего в переводах'}
            </div>
            <div className="status-icon blue">
              <ArrowRightLeft size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="status-card-value">
            ${(totalRevenue * 0.35).toLocaleString()}
          </div>
        </div>
        <div className="status-card">
          <div className="status-card-header">
            <div className="status-card-label">
              {t('fromExchangeRate') || 'От курсовой разницы'}
            </div>
            <div className="status-icon purple">
              <Percent size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="status-card-value">
            ${(totalRevenue * 0.25).toLocaleString()}
          </div>
        </div>
        <div className="status-card">
          <div className="status-card-header">
            <div className="status-card-label">
              {t('otherRevenue') || 'Прочая выручка'}
            </div>
            <div className="status-icon orange">
              <DollarSign size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="status-card-value">
            ${(totalRevenue * 0.03).toLocaleString()}
          </div>
        </div>
        <div className="status-card">
          <div className="status-card-header">
            <div className="status-card-label">
              {t('totalCommission') || 'Всего комиссии'}
            </div>
            <div className="status-icon green">
              <Receipt size={16} strokeWidth={3} />
            </div>
          </div>
          <div className="status-card-value">
            ${(totalRevenue * 0.42).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Total Revenue Text */}
      <div className="report-total">
        <div className="report-total-label">
          {t('totalRevenueFrom') || 'Общая выручка за 1 января 2025 - 1 июня 2025'}
        </div>
        <div className="report-total-value">
          ${totalRevenue.toLocaleString()}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="report-chart">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="month" stroke={chartColors.text} />
            <YAxis stroke={chartColors.text} />
            <Tooltip
              contentStyle={{
                background: theme === 'dark' ? '#202020' : '#ffffff',
                border: `1px solid ${chartColors.grid}`,
                borderRadius: '0.5rem',
                color: chartColors.text
              }}
            />
            <Bar dataKey="revenue" fill={chartColors.revenue} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Corridors and Currency Pairs Tables */}
      <div className="report-tables">
        {/* Top 10 Corridors */}
        <div className="report-table-container">
          <h3 className="report-table-title">
            {t('top10Corridors') || 'Топ 10 коридоров'}
          </h3>
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>{t('corridor') || 'Коридор'}</th>
                  <th>{t('volume') || 'Объем'}</th>
                  <th>{t('revenue') || 'Доход'}</th>
                  <th>{t('share') || 'Доля'}</th>
                </tr>
              </thead>
              <tbody>
                {topCorridors.map((item, index) => (
                  <tr key={index}>
                    <td>{item.corridor}</td>
                    <td>{item.volume}</td>
                    <td>{item.revenue}</td>
                    <td>{item.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 10 Currency Pairs */}
        <div className="report-table-container">
          <h3 className="report-table-title">
            {t('top10CurrencyPairs') || 'Топ 10 валютных пар'}
          </h3>
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>{t('pair') || 'Пара'}</th>
                  <th>{t('volume') || 'Объем'}</th>
                  <th>{t('spreadIncome') || 'Доход от спреда'}</th>
                  <th>{t('avgSpread') || 'Средний спред'}</th>
                </tr>
              </thead>
              <tbody>
                {topCurrencyPairs.map((item, index) => (
                  <tr key={index}>
                    <td>{item.pair}</td>
                    <td>{item.volume}</td>
                    <td>{item.spread}</td>
                    <td>{item.avgSpread}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueReport
