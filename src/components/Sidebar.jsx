import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import '../styles/Sidebar.css'
import { useGlobalContext } from '../context'
import { ArrowLeftRight, BarChart, UserCog, UsersIcon, ChevronDown, PanelLeftClose, PanelLeft, MessagesSquare, LogOut, ChevronUp, ChevronsUpDown, Globe } from 'lucide-react'
import { apiFetch } from '../api.js'

const Sidebar = () => {
  const { t, sidebarCollapsed, setSidebarCollapsed,setSidebarWidth,sidebarWidth, handleLogout } = useGlobalContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [showReportsMenu, setShowReportsMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Get admin info from localStorage
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@fastorika.com'
  const adminRole = localStorage.getItem('adminRole') || 'ADMIN'
  const adminInitial = adminEmail.charAt(0).toUpperCase()
  const isSuperAdmin = adminRole === 'SUPER_ADMIN' || adminRole === 'SUPERADMIN'

  // Admin permissions
  const [permissions, setPermissions] = useState({
    clientManagementEnabled: true,
    reportsEnabled: true,
    transactionsEnabled: true,
    administrationEnabled: true
  })

  // Load current admin's permissions
  useEffect(() => {
    const loadMyPermissions = async () => {
      // SuperAdmin has all permissions
      if (isSuperAdmin) {
        setPermissions({
          clientManagementEnabled: true,
          reportsEnabled: true,
          transactionsEnabled: true,
          administrationEnabled: true
        })
        return
      }

      try {
        // Get current admin's data from backend
        const adminId = localStorage.getItem('adminId')
        if (!adminId) return

        const res = await apiFetch(`admins/${adminId}`)
        const responseData = await res.json()

        if (res.ok && responseData.success && responseData.data) {
          const adminData = responseData.data
          setPermissions({
            clientManagementEnabled: adminData.clientManagementEnabled || false,
            reportsEnabled: adminData.reportsEnabled || false,
            transactionsEnabled: adminData.transactionsEnabled || false,
            administrationEnabled: adminData.administrationEnabled || false
          })
        }
      } catch (err) {
        console.error('Load permissions error:', err)
      }
    }

    loadMyPermissions()
  }, [isSuperAdmin])

  // Check if we're on a reports page
  const isReportsActive = location.pathname.startsWith('/reports')

  // Report submenu items
  const reportMenuItems = [
    { path: '/reports/transactions', label: t('transactions') || 'Transactions' },
    { path: '/reports/revenue', label: t('revenueAndCommissions') || 'Revenue and Commissions' },
    { path: '/reports/balances', label: t('providerBalances') || 'Provider Balances' }
  ]

  const handleReportClick = (path) => {
    navigate(path)
    setShowReportsMenu(false)
  }
  const handleCollapse = () =>{
    setSidebarCollapsed(!sidebarCollapsed)
    setSidebarWidth(sidebarWidth == "80px" ? "280px" : "80px")
  }

  return (
    <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} style={{
      width:sidebarWidth
    }}>
        <div className='sidebar-header'>
          <div className='brand'>
            <img src="/images/logoside.svg" alt="" />
            {!sidebarCollapsed && <span>{t('brand.admin') || 'Admin'}</span>}
          </div>
          <button
            className='sidebar-toggle'
            onClick={() => handleCollapse()}
            title={sidebarCollapsed ? (t('expandSidebar') || 'Expand sidebar') : (t('collapseSidebar') || 'Collapse sidebar')}
          >
            {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <div className='sidebar-list'>
          {/* Clients - only show if clientManagementEnabled */}
          {permissions.clientManagementEnabled && (
            <NavLink to={'/'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} title={t("clients")}>
              <UsersIcon size={20}/>
              {!sidebarCollapsed && <span>{t("clients")}</span>}
            </NavLink>
          )}

          {/* Transactions - only show if transactionsEnabled */}
          {permissions.transactionsEnabled && (
            <NavLink to={'/transactions'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} title={t("transactions")}>
              <ArrowLeftRight size={20}/>
              {!sidebarCollapsed && <span>{t("transactions")}</span>}
            </NavLink>
          )}

          {/* Reports Dropdown - only show if reportsEnabled */}
          {permissions.reportsEnabled && (
            <div className="reports-dropdown">
              <button
                onClick={() => setShowReportsMenu(!showReportsMenu)}
                className={`nav-link reports-toggle ${isReportsActive ? 'active' : ''}`}
                title={t("reports")}
              >
                <BarChart size={20}/>
                {!sidebarCollapsed && (
                  <>
                    <span style={{ flex: 1 }}>{t("reports")}</span>
                    <ChevronDown
                      size={16}
                      style={{
                        marginLeft:"5rem",
                        transition: 'transform 0.2s',
                        transform: showReportsMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}
                    />
                  </>
                )}
              </button>

              {showReportsMenu && (
                <div className="reports-submenu">
                  {reportMenuItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleReportClick(item.path)}
                      className={`submenu-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Admins - only show if administrationEnabled */}
          {permissions.administrationEnabled && (
            <NavLink to={'/admins'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} title={t("admins")}>
              <UserCog size={20}/>
              {!sidebarCollapsed && <span>{t("admins")}</span>}
            </NavLink>
          )}

          {/* Countries - only show if administrationEnabled */}
          {permissions.administrationEnabled && (
            <NavLink to={'/countries'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} title={t("countries") || "Countries"}>
              <Globe size={20}/>
              {!sidebarCollapsed && <span>{t("countries") || "Countries"}</span>}
            </NavLink>
          )}

          {/* Support - only show if clientManagementEnabled */}
          {permissions.clientManagementEnabled && (
            <NavLink to={'/support'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} title={t("support")}>
              <MessagesSquare size={20}/>
              {!sidebarCollapsed && <span>{t("support")}</span>}
            </NavLink>
          )}
      </div>
      <div className='sidebar-account'>
        <div className="user-menu-container">
          {showUserMenu && (
            <div className="user-menu-popup">
              <button className="user-menu-item logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
          <button
            className="user-account-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="User Account"
          >
            <div className="user-avatar">
              <span>{adminInitial}</span>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="user-info">
                  <span className="user-name">{adminRole}</span>
                  <span className="user-email">{adminEmail}</span>
                </div>
                {
                  showUserMenu ?
                  <ChevronDown size={16}/> :<ChevronsUpDown size={16}/>
                }
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
