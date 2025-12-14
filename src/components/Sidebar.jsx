import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import '../styles/Sidebar.css'
import { useGlobalContext } from '../context'
import { ArrowLeftRight, BarChart, UserCog, UsersIcon, ChevronDown, PanelLeftClose, PanelLeft, MessagesSquare } from 'lucide-react'

const Sidebar = () => {
  const { t, sidebarCollapsed, setSidebarCollapsed,setSidebarWidth,sidebarWidth } = useGlobalContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [showReportsMenu, setShowReportsMenu] = useState(false)

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
          <NavLink to={'/'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} title={t("clients")}>
            <UsersIcon size={20}/>
            {!sidebarCollapsed && <span>{t("clients")}</span>}
          </NavLink>
          <NavLink to={'/transactions'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} title={t("transactions")}>
            <ArrowLeftRight size={20}/>
            {!sidebarCollapsed && <span>{t("transactions")}</span>}
          </NavLink>

          {/* Reports Dropdown */}
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

          <NavLink to={'/admins'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} title={t("admins")}>
            <UserCog size={20}/>
            {!sidebarCollapsed && <span>{t("admins")}</span>}
          </NavLink>
          <NavLink to={'/support'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} title={t("support")}>
            <MessagesSquare size={20}/>
            {!sidebarCollapsed && <span>{t("support")}</span>}
          </NavLink>
      </div>
      <div className='sidebar-account'>

      </div>
    </aside>
  )
}

export default Sidebar
