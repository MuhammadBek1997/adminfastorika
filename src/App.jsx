
import { Route, Routes } from 'react-router-dom';
import './App.css'
import { useGlobalContext } from './context.js'
import Clients from './pages/Clients.jsx';
import Sidebar from './components/Sidebar.jsx';
import Transactions from './pages/Transactions.jsx';
import Reports from './pages/Reports.jsx';
import TransactionsReport from './pages/reports/TransactionsReport.jsx';
import RevenueReport from './pages/reports/RevenueReport.jsx';
import BalancesReport from './pages/reports/BalancesReport.jsx';
import Admins from './pages/Admins.jsx';
import Login from './pages/Login.jsx';
import Support from './pages/Support.jsx';

function App() {
  const { theme, sidebarWidth} = useGlobalContext();

  

  if (!localStorage.getItem("adminlog")) {
    return (
    <div id={theme} className="app-root">
      <Login/>
    </div>
  )
  }else{
    return (
    <div id={theme} className="app-root">
      <Sidebar/>
      <div className="main-content" style={{marginLeft:sidebarWidth}}>
        <Routes>
          <Route path='/' element={<Clients/>}/>
          <Route path='/transactions' element={<Transactions/>}/>
          <Route path='/reports' element={<Reports/>}>
            <Route index element={<TransactionsReport/>}/>
            <Route path='transactions' element={<TransactionsReport/>}/>
            <Route path='revenue' element={<RevenueReport/>}/>
            <Route path='balances' element={<BalancesReport/>}/>
          </Route>
          <Route path='/admins' element={<Admins/>}/>
          <Route path='/support' element={<Support/>}/>
        </Routes>
      </div>
    </div>
  )
  }

  
}

export default App
