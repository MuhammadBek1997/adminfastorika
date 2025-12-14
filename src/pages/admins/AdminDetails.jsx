import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../../context.js'
import { ChevronLeft, Edit, Trash2, UsersIcon, ArrowLeftRight, BarChart, UserCog } from 'lucide-react'
import '../../styles/Clients.css'
import '../../styles/Admins.css'

const AdminDetails = () => {
  const { t } = useGlobalContext()
  const navigate = useNavigate()
  const { adminId } = useParams()
  const location = useLocation()

  const adminFromState = location.state?.admin

  const [admin] = useState(adminFromState || {
    id: adminId,
    name: 'Иван Иванов',
    email: 'example@gmail.com',
    phone: '+7 800 323 02 84',
    password: '12345'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedAdmin, setEditedAdmin] = useState({
    name: admin.name,
    email: admin.email,
    phone: admin.phone || '+7 800 323 02 84',
    password: admin.password || '12345'
  })

  const [access, setAccess] = useState({
    clients: true,
    transactions: false,
    reports: false,
    admins: true
  })

  const toggle = (key) => setAccess(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="client-details-container">
      <div className="client-nav">
        <button className="back-button" onClick={() => navigate('/admins')}>
          <ChevronLeft size={16} />
          {t('back') || 'Назад'}
        </button>
        <div className="breadcrumb">{t('admins') || 'Администраторы'} / {editedAdmin.name}</div>
      </div>

      <div className="client-content">
        <div className="client-info-panel">
          <div className="client-data-section">
            <div className="section-subtitle">{t('administratorData') || 'Данные администратора'}</div>

            <div className="data-row">
              <div className="data-label">{t('name') || 'Имя'}</div>
              {isEditing ? (
                <input
                  value={editedAdmin.name}
                  onChange={(e) => setEditedAdmin(s => ({ ...s, name: e.target.value }))}
                  className="data-value"
                  style={{ border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '0.5rem' }}
                />
              ) : (
                <div className="data-value">{editedAdmin.name}</div>
              )}
            </div>

            <div className="data-row">
              <div className="data-label">{t('email') || 'Почта'}</div>
              {isEditing ? (
                <input
                  value={editedAdmin.email}
                  onChange={(e) => setEditedAdmin(s => ({ ...s, email: e.target.value }))}
                  className="data-value"
                  style={{ border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '0.5rem' }}
                />
              ) : (
                <div className="data-value">{editedAdmin.email}</div>
              )}
            </div>

            <div className="data-row">
              <div className="data-label">{t('phone') || 'Телефон'}</div>
              {isEditing ? (
                <input
                  value={editedAdmin.phone}
                  onChange={(e) => setEditedAdmin(s => ({ ...s, phone: e.target.value }))}
                  className="data-value"
                  style={{ border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '0.5rem' }}
                />
              ) : (
                <div className="data-value">{editedAdmin.phone}</div>
              )}
            </div>

            <div className="data-row">
              <div className="data-label">{t('password') || 'Пароль'}</div>
              {isEditing ? (
                <input
                  type="password"
                  value={editedAdmin.password}
                  onChange={(e) => setEditedAdmin(s => ({ ...s, password: e.target.value }))}
                  className="data-value"
                  style={{ border: '1px solid var(--border)', borderRadius: '0.375rem', padding: '0.5rem' }}
                />
              ) : (
                <div className="data-value">{editedAdmin.password}</div>
              )}
            </div>

            <button className="btn-edit" onClick={() => setIsEditing(!isEditing)}>
              <Edit size={16} />
              {isEditing ? (t('save') || 'Сохранить') : (t('edit') || 'Редактировать')}
            </button>
          </div>

          <button className="btn-block" style={{ marginTop: '0.75rem' }}>
            <Trash2 size={16} />
            {t('deleteAdministrator') || 'Удалить администратора'}
          </button>
        </div>

        <div className="client-stats-section">
          <div className="section-subtitle">{t('modulesAccess') || 'Доступы к модулям'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <AccessItem icon={<UsersIcon size={18} />} title={t('clients') || 'Клиенты'} checked={access.clients} onToggle={() => toggle('clients')} />
            <AccessItem icon={<ArrowLeftRight size={18} />} title={t('transactions') || 'Транзакции'} checked={access.transactions} onToggle={() => toggle('transactions')} />
            <AccessItem icon={<BarChart size={18} />} title={t('reports') || 'Отчёты'} checked={access.reports} onToggle={() => toggle('reports')} />
            <AccessItem icon={<UserCog size={18} />} title={t('admins') || 'Администраторы'} checked={access.admins} onToggle={() => toggle('admins')} />
          </div>
        </div>
      </div>
    </div>
  )
}

const AccessItem = ({ icon, title, checked, onToggle }) => {
  return (
    <div className="access-item">
      <div className="access-item-content">
        <div className={`access-item-icon ${checked ? 'active' : 'inactive'}`}>
          {icon}
        </div>
        <div className="data-value">{title}</div>
      </div>
      <label className="custom-toggle">
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <span className="toggle-slider"></span>
      </label>
    </div>
  )
}

export default AdminDetails
