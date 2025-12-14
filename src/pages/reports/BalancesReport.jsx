import { useGlobalContext } from '../../context.js'
import '../../styles/Reports.css'

const BalancesReport = () => {
  const { t, theme } = useGlobalContext()

  // Mock data for Provider Balances
  const providerBalances = [
    {
      name: 'CryptoProvider A',
      type: 'Crypto',
      balances: [
        { currency: 'USD', balance: '$50,000', inDollars: '$50,000' },
        { currency: 'EUR', balance: '€30,000', inDollars: '$32,400' },
        { currency: 'MXN', balance: '₱500,000', inDollars: '$29,000' }
      ],
      total: '$111,400',
      liquidity: 'High'
    },
    {
      name: 'CryptoProvider B',
      type: 'Crypto',
      balances: [
        { currency: 'USD', balance: '$50,000', inDollars: '$50,000' },
        { currency: 'EUR', balance: '€30,000', inDollars: '$32,400' },
        { currency: 'MXN', balance: '₱500,000', inDollars: '$29,000' }
      ],
      total: '$111,400',
      liquidity: 'High'
    },
    {
      name: 'CryptoProvider C',
      type: 'Crypto',
      balances: [
        { currency: 'USD', balance: '$50,000', inDollars: '$50,000' },
        { currency: 'EUR', balance: '€30,000', inDollars: '$32,400' },
        { currency: 'MXN', balance: '₱500,000', inDollars: '$29,000' }
      ],
      total: '$111,400',
      liquidity: 'High'
    },
    {
      name: 'CryptoProvider D',
      type: 'Crypto',
      balances: [
        { currency: 'USD', balance: '$50,000', inDollars: '$50,000' },
        { currency: 'EUR', balance: '€30,000', inDollars: '$32,400' },
        { currency: 'MXN', balance: '₱500,000', inDollars: '$29,000' }
      ],
      total: '$111,400',
      liquidity: 'High'
    }
  ]

  const totalProviderBalance = '$130,000'
  const overallLiquidity = 'high'

  // Chart colors based on theme
  const chartColors = theme === 'dark' ? {
    sent: '#10b981',
    declined: '#ef4444',
    revenue: '#00D796'
  } : {
    sent: '#10b981',
    declined: '#ef4444',
    revenue: '#00D796'
  }

  return (
    <div className="report-container">
      {/* Overall Summary */}
      <div className="provider-summary">
        <div className="status-card">
          <div className="status-card-label">
            {t('totalBalance') || 'Total Balance in USD Equivalent'}
          </div>
          <div className="status-card-value" style={{ fontSize: '1.5rem', color: chartColors.revenue }}>
            {totalProviderBalance}
          </div>
        </div>
        <div className="status-card">
          <div className="status-card-label">
            {t('overallLiquidity') || 'Overall Liquidity'}
          </div>
          <div
            className="status-card-value"
            style={{
              fontSize: '1.5rem',
              color: overallLiquidity === 'high' ? chartColors.sent : chartColors.declined
            }}
          >
            {t('liquidity.high') || 'High'}
          </div>
        </div>
      </div>

      {/* Provider Balance Cards */}
      <div className="provider-cards">
        {providerBalances.map((provider, index) => (
          <div key={index} className="provider-card">
            <div className="provider-card-header">
              <div>
                <h3 className="provider-card-title">
                  {provider.name}
                </h3>
                <div className="provider-card-type">
                  {t('type') || 'Type'}: {t(`type.${provider.type.toLowerCase()}`) || provider.type}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="provider-card-total-label">
                  {t('total') || 'Total'}
                </div>
                <div className="provider-card-total-value">
                  {provider.total}
                </div>
              </div>
            </div>

            {/* Balance Table */}
            <table className="report-table">
              <thead>
                <tr>
                  <th>{t('currency') || 'Currency'}</th>
                  <th style={{ textAlign: 'right' }}>{t('balance') || 'Balance'}</th>
                  <th style={{ textAlign: 'right' }}>{t('inDollars') || 'In Dollars'}</th>
                </tr>
              </thead>
              <tbody>
                {provider.balances.map((balance, bIndex) => (
                  <tr key={bIndex}>
                    <td>{balance.currency}</td>
                    <td style={{ textAlign: 'right' }}>{balance.balance}</td>
                    <td style={{ textAlign: 'right' }}>{balance.inDollars}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BalancesReport
