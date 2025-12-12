import { Outlet } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar.jsx'
import { useGlobalContext } from '../context.js'

const Reports = () => {
  const { t } = useGlobalContext()

  return (
    <section className="admin-section">
      <div className="section-header">
        <h2 className="section-title">
          {t("reports")}
        </h2>
        <AdminNavbar/>
      </div>

      <div className="section-body" style={{ padding: '1.5rem' }}>
        {/* Report Content - rendered by nested routes */}
        <Outlet />
      </div>
    </section>
  )
}

export default Reports
