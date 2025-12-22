import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context.js'
import { apiFetch } from '../../api.js'
import { Plus, Search, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft } from 'lucide-react'
import '../../styles/Countries.css'

const CountriesList = () => {
  const { t } = useGlobalContext()
  const navigate = useNavigate()

  const [countries, setCountries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [itemsPerPage] = useState(10)
  const [updatingCountryId, setUpdatingCountryId] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Check if user is super admin
  const adminRole = localStorage.getItem('adminRole')
  const isSuperAdmin = adminRole === 'SUPER_ADMIN' || adminRole === 'SUPERADMIN'

  // Load countries from backend
  const loadCountries = async () => {
    setIsLoading(true)
    try {
      const res = await apiFetch(`countries?page=${currentPage}&size=${itemsPerPage}`)
      const responseData = await res.json()

      console.log('Load countries response:', responseData)

      // Handle different response structures
      let countriesData = []
      let totalPagesCount = 0

      if (responseData.success && responseData.data) {
        // Structure: { success: true, data: { content: [...], totalPages: N } }
        if (Array.isArray(responseData.data)) {
          countriesData = responseData.data
          totalPagesCount = 1
        } else if (responseData.data.content) {
          countriesData = responseData.data.content
          totalPagesCount = responseData.data.totalPages || 0
        } else {
          countriesData = [responseData.data]
          totalPagesCount = 1
        }
      } else if (responseData.content) {
        // Structure: { content: [...], totalPages: N }
        countriesData = responseData.content
        totalPagesCount = responseData.totalPages || 0
      } else if (Array.isArray(responseData)) {
        // Direct array
        countriesData = responseData
        totalPagesCount = 1
      }

      console.log('Parsed countries data:', countriesData)
      console.log('Total pages:', totalPagesCount)

      setCountries(countriesData)
      setTotalPages(totalPagesCount)
    } catch (err) {
      console.error('Load countries error:', err)
      alert(t('networkError') || 'Сетевая ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCountries()
  }, [currentPage])

  // Filter countries by search
  const filteredCountries = countries.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (c.name || '').toLowerCase().includes(q) ||
           (c.isoCode || '').toLowerCase().includes(q) ||
           (c.phoneCode || '').toLowerCase().includes(q)
  })

  // Sort countries
  const sortedCountries = [...filteredCountries].sort((a, b) => {
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

  const handleAddCountry = () => {
    navigate('/countries/new')
  }

  const handleRowClick = (country, e) => {
    // Don't navigate if clicking on the toggle switch
    if (e.target.closest('.switch-container')) {
      return
    }
    navigate(`/countries/${country.id}`, { state: { country } })
  }

  const handleToggleActive = async (country, e) => {
    e.stopPropagation() // Prevent row click

    if (!isSuperAdmin) {
      alert(t('noPermission') || 'У вас нет прав для изменения статуса страны')
      return
    }

    if (updatingCountryId === country.id) return

    setUpdatingCountryId(country.id)

    try {
      const requestBody = {
        name: country.name,
        isoCode: country.isoCode,
        phoneCode: country.phoneCode,
        currency: country.currency,
        active: !country.active
      }

      console.log('Toggle active request:', requestBody)

      const res = await apiFetch(`countries/${country.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const responseData = await res.json()

      console.log('Toggle active response:', responseData)

      if (!res.ok) {
        alert(responseData.message || 'Ошибка при изменении статуса страны')
        return
      }

      // Update local state
      setCountries(prevCountries =>
        prevCountries.map(c =>
          c.id === country.id ? { ...c, active: !c.active } : c
        )
      )
    } catch (err) {
      console.error('Toggle active error:', err)
      alert(t('networkError') || 'Сетевая ошибка')
    } finally {
      setUpdatingCountryId(null)
    }
  }

  return (
    <div className="countries-list-container">
      {/* Search and Add */}
      <div className="list-controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder={t('searchCountries') || 'Поиск стран...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {isSuperAdmin && (
          <button className="add-btn" onClick={handleAddCountry}>
            <Plus size={18} />
            <span>{t('addCountry') || 'Добавить страну'}</span>
          </button>
        )}
      </div>

      {/* Countries Table */}
      {isLoading ? (
        <div className="loading-message">{t('loading') || 'Загрузка...'}</div>
      ) : sortedCountries.length === 0 ? (
        <div className="no-data-message">{t('noData') || 'Нет данных'}</div>
      ) : (
        <div className="countries-table-wrapper">
          <table className="countries-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  <div className="th-content">
                    {t('id') || 'ID'}
                    <ArrowUpDown size={12} className="sort-icon" />
                  </div>
                </th>
                <th onClick={() => handleSort('name')}>
                  <div className="th-content">
                    {t('name') || 'Название'}
                    <ArrowUpDown size={12} className="sort-icon" />
                  </div>
                </th>
                <th onClick={() => handleSort('isoCode')}>
                  <div className="th-content">
                    {t('isoCode') || 'ISO код'}
                    <ArrowUpDown size={12} className="sort-icon" />
                  </div>
                </th>
                <th onClick={() => handleSort('phoneCode')}>
                  <div className="th-content">
                    {t('phoneCode') || 'Телефон код'}
                    <ArrowUpDown size={12} className="sort-icon" />
                  </div>
                </th>
                <th onClick={() => handleSort('currency')}>
                  <div className="th-content">
                    {t('currency') || 'Валюта'}
                    <ArrowUpDown size={12} className="sort-icon" />
                  </div>
                </th>
                <th onClick={() => handleSort('active')}>
                  <div className="th-content">
                    {t('status') || 'Статус'}
                    <ArrowUpDown size={12} className="sort-icon" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCountries.map((country) => (
                <tr key={country.id} onClick={(e) => handleRowClick(country, e)}>
                  <td>{country.id}</td>
                  <td>{country.name}</td>
                  <td>{country.isoCode}</td>
                  <td>{country.phoneCode}</td>
                  <td>{country.currency}</td>
                  <td>
                    <div className="switch-container" onClick={(e) => e.stopPropagation()}>
                      <label className={`switch ${!isSuperAdmin ? 'disabled' : ''}`}>
                        <input
                          type="checkbox"
                          checked={country.active}
                          onChange={(e) => handleToggleActive(country, e)}
                          disabled={!isSuperAdmin || updatingCountryId === country.id}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(0)}
            disabled={currentPage === 0}
            className="pagination-btn"
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="pagination-btn"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="pagination-info">
            {t('page') || 'Страница'} {currentPage + 1} {t('of') || 'из'} {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
            className="pagination-btn"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            className="pagination-btn"
            aria-label="Last page"
          >
            <ChevronRight size={16} />
            <ChevronRight size={16} style={{ marginLeft: '-8px' }} />
          </button>
        </div>
      )}
    </div>
  )
}

export default CountriesList
