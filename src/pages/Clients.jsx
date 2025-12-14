import { Outlet } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar.jsx'
import { useGlobalContext } from '../context.js'

const Clients = () => {
  const { t } = useGlobalContext()

  return (
    <section className="admin-section">
      <div className="section-header">
        <h2 className="section-title">
          {t("clients")}
        </h2>
        <AdminNavbar/>
      </div>

      <div className="section-body" style={{ padding: '1.5rem' }}>
        {/* Client Content - rendered by nested routes */}
        <Outlet />
      </div>
    </section>
  )
}

export default Clients
