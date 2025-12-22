import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../../context.js'
import { apiFetch } from '../../api.js'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import '../../styles/Countries.css'

const CountryDetails = () => {
  const { t } = useGlobalContext()
  const { countryId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const countryFromState = location.state?.country

  const [country, setCountry] = useState(countryFromState || null)
  const [editedCountry, setEditedCountry] = useState({
    name: '',
    isoCode: '',
    phoneCode: '',
    currency: '',
    active: true
  })
  const [isSaving, setIsSaving] = useState(false)

  // Check if user is super admin
  const adminRole = localStorage.getItem('adminRole')
  const isSuperAdmin = adminRole === 'SUPER_ADMIN' || adminRole === 'SUPERADMIN'

  const isNewCountry = countryId === 'new'

  // Load country data from backend
  useEffect(() => {
    const loadCountryData = async () => {
      if (isNewCountry) {
        setEditedCountry({
          name: '',
          isoCode: '',
          phoneCode: '+',
          currency: '',
          active: true
        })
        return
      }

      if (!countryId) return

      try {
        const res = await apiFetch(`countries/${countryId}`)
        const responseData = await res.json()

        console.log('Load country data response:', responseData)

        if (res.ok && responseData.success && responseData.data) {
          const countryData = responseData.data
          setCountry(countryData)
          setEditedCountry({
            name: countryData.name || '',
            isoCode: countryData.isoCode || '',
            phoneCode: countryData.phoneCode || '+',
            currency: countryData.currency || '',
            active: countryData.active !== undefined ? countryData.active : true
          })
        } else if (res.ok && responseData.name) {
          // Direct country object
          setCountry(responseData)
          setEditedCountry({
            name: responseData.name || '',
            isoCode: responseData.isoCode || '',
            phoneCode: responseData.phoneCode || '+',
            currency: responseData.currency || '',
            active: responseData.active !== undefined ? responseData.active : true
          })
        }
      } catch (err) {
        console.error('Load country data error:', err)
      }
    }

    if (!countryFromState) {
      loadCountryData()
    } else {
      setEditedCountry({
        name: countryFromState.name || '',
        isoCode: countryFromState.isoCode || '',
        phoneCode: countryFromState.phoneCode || '+',
        currency: countryFromState.currency || '',
        active: countryFromState.active !== undefined ? countryFromState.active : true
      })
    }
  }, [countryId, countryFromState, isNewCountry])

  const handleDeleteCountry = async () => {
    if (!isSuperAdmin) {
      alert(t('noPermission') || 'У вас нет прав для удаления страны')
      return
    }

    if (!confirm(t('confirmDelete') || 'Вы уверены, что хотите удалить эту страну?')) {
      return
    }

    try {
      const res = await apiFetch(`countries/${countryId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const responseData = await res.json()
        alert(responseData.message || 'Ошибка при удалении страны')
        return
      }

      alert(t('countryDeleted') || 'Страна успешно удалена')
      navigate('/countries')
    } catch (err) {
      console.error('Delete country error:', err)
      alert(t('networkError') || 'Сетевая ошибка')
    }
  }

  const handleSaveCountry = async () => {
    if (!isSuperAdmin) {
      alert(t('noPermission') || 'У вас нет прав для изменения страны')
      return
    }

    if (!editedCountry.name?.trim() || !editedCountry.isoCode?.trim() || !editedCountry.phoneCode?.trim() || !editedCountry.currency?.trim()) {
      alert(t('fillAllFields') || 'Заполните все обязательные поля')
      return
    }

    setIsSaving(true)

    try {
      const requestBody = {
        name: editedCountry.name.trim(),
        isoCode: editedCountry.isoCode.trim().toUpperCase(),
        phoneCode: editedCountry.phoneCode.trim(),
        currency: editedCountry.currency.trim().toUpperCase(),
        active: editedCountry.active
      }

      console.log('Save country request:', requestBody)

      const url = isNewCountry ? 'countries' : `countries/${countryId}`
      const method = isNewCountry ? 'POST' : 'PUT'

      const res = await apiFetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const responseData = await res.json()

      console.log('Save country response:', responseData)

      if (!res.ok) {
        alert(responseData.message || 'Ошибка при сохранении страны')
        return
      }

      alert(
        isNewCountry
          ? (t('countryCreated') || 'Страна успешно создана')
          : (t('countryUpdated') || 'Страна успешно обновлена')
      )

      // Navigate back to countries list
      navigate('/countries')
    } catch (err) {
      console.error('Save country error:', err)
      alert(t('networkError') || 'Сетевая ошибка')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="country-details-container">
      {/* Header */}
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate('/countries')}>
          <ArrowLeft size={18} />
          <span>{t('back') || 'Назад'}</span>
        </button>
        <h3>{isNewCountry ? (t('newCountry') || 'Новая страна') : (country?.name || t('countryDetails') || 'Детали страны')}</h3>
      </div>

      {/* Country Form */}
      <div className="details-body">
        <div className="form-section">
          <h4>{t('countryInformation') || 'Информация о стране'}</h4>

          <div className="form-row">
            <div className="form-field">
              <label>{t('name') || 'Название'} *</label>
              <input
                type="text"
                value={editedCountry.name}
                onChange={(e) => setEditedCountry({ ...editedCountry, name: e.target.value })}
                placeholder={t('enterCountryName') || 'Введите название страны (например, Узбекистан)'}
                disabled={!isSuperAdmin}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>{t('isoCode') || 'ISO код'} *</label>
              <input
                type="text"
                value={editedCountry.isoCode}
                onChange={(e) => setEditedCountry({ ...editedCountry, isoCode: e.target.value.toUpperCase() })}
                placeholder={t('enterIsoCode') || 'Введите ISO код (например, UZ)'}
                maxLength={3}
                disabled={!isSuperAdmin}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>{t('phoneCode') || 'Телефон код'} *</label>
              <input
                type="text"
                value={editedCountry.phoneCode}
                onChange={(e) => setEditedCountry({ ...editedCountry, phoneCode: e.target.value })}
                placeholder={t('enterPhoneCode') || 'Введите телефонный код (например, +998)'}
                disabled={!isSuperAdmin}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>{t('currency') || 'Валюта'} *</label>
              <input
                type="text"
                value={editedCountry.currency}
                onChange={(e) => setEditedCountry({ ...editedCountry, currency: e.target.value.toUpperCase() })}
                placeholder={t('enterCurrency') || 'Введите код валюты (например, UZS)'}
                maxLength={3}
                disabled={!isSuperAdmin}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>{t('status') || 'Статус'}</label>
              <div className="switch-container-details">
                <label className={`switch ${!isSuperAdmin ? 'disabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={editedCountry.active}
                    onChange={(e) => setEditedCountry({ ...editedCountry, active: e.target.checked })}
                    disabled={!isSuperAdmin}
                  />
                  <span className="slider"></span>
                </label>
                <span className="switch-label">
                  {editedCountry.active ? (t('active') || 'Активный') : (t('inactive') || 'Неактивный')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isSuperAdmin && (
            <div className="form-actions">
              <button
                className="save-btn"
                onClick={handleSaveCountry}
                disabled={isSaving}
              >
                <Save size={18} />
                <span>{isSaving ? (t('saving') || 'Сохранение...') : (t('save') || 'Сохранить')}</span>
              </button>
              {!isNewCountry && (
                <button
                  className="delete-btn-form"
                  onClick={handleDeleteCountry}
                  disabled={isSaving}
                >
                  <Trash2 size={18} />
                  <span>{t('delete') || 'Удалить'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CountryDetails
