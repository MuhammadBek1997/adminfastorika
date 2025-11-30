import React from 'react'
import AdminNavbar from '../components/AdminNavbar.jsx'
import { useGlobalContext } from '../context.js'

const Clients = () => {
  let {t} = useGlobalContext()
  return (
    <section className="admin-section">
      <div className="section-header">
        <h2 className="section-title">
          {t("clients")}
        </h2>
        <AdminNavbar/>
      </div>
      <div className="section-body">
        
      </div>
    </section>
  )
}

export default Clients
