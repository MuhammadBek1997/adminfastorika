import React from 'react'
import { NavLink } from 'react-router-dom'
import '../styles/Sidebar.css'
import { useGlobalContext } from '../context'
import { ArrowLeftRight, ArrowRightCircle, BarChart, UserCog, UserCog2, UsersIcon } from 'lucide-react'

const Sidebar = () => {

  let {t} = useGlobalContext()

  return (
    <aside className="admin-sidebar">
        <div className='brand'>
          <img src="/images/logoside.svg" alt="" />
          <span>Admin</span>
        </div>
        <div className='sidebar-list'>
          <NavLink to={'/'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <UsersIcon size={20}/>
            {t("clients")}
          </NavLink>
          <NavLink to={'/transactions'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <ArrowLeftRight size={20}/>
            {t("transactions")}
          </NavLink>
          <NavLink to={'/reports'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <BarChart size={20}/>
            {t("reports")}
          </NavLink>
          <NavLink to={'/admins'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <UserCog size={20}/>
            {t("admins")}
          </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar
