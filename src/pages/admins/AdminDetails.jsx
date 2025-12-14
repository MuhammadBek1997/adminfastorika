import { useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../../context.js'
import { ChevronLeft, Edit, Trash2, UsersIcon, ArrowLeftRight, BarChart, UserCog } from 'lucide-react'
import Switch from 'react-switch'
import '../../styles/Clients.css'

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: checked ? '#10b981' : '#4b5563', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div className="data-value">{title}</div>
      </div>
      <Switch
        onChange={onToggle}
        checked={checked}
        onColor="#10b981"
        offColor="#4b5563"
        onHandleColor="#fff"
        offHandleColor="#d1d5db"
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 3px rgba(0, 0, 0, 0.4)"
        activeBoxShadow="0px 0px 1px 5px rgba(16, 185, 129, 0.2)"
        height={24}
        width={48}
      />
    </div>
  )
}

export default AdminDetails
