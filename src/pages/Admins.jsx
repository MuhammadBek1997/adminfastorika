import { Outlet } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar.jsx'
import { useGlobalContext } from '../context.js'

const Admins = () => {
  const { t } = useGlobalContext()

  return (
    <section className="admin-section">
      <div className="section-header">
        <h2 className="section-title">
          {t("admins")}
        </h2>
        <AdminNavbar />
      </div>
      <div className="section-body">
        <Outlet />
      </div>
    </section>
  )
}

export default Admins
