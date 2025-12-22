import { Outlet } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar.jsx'
import { useGlobalContext } from '../context.js'

const Countries = () => {
  const { t } = useGlobalContext()

  return (
    <section className="admin-section">
      <div className="section-header">
        <h2 className="section-title">
          {t("countries")}
        </h2>
        <AdminNavbar />
      </div>
      <div className="section-body">
        <Outlet />
      </div>
    </section>
  )
}

export default Countries
