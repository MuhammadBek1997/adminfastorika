
import { Route, Routes } from 'react-router-dom';
import './App.css'
import { useGlobalContext } from './context.js'
import Clients from './pages/Clients.jsx';
import ClientsList from './pages/clients/ClientsList.jsx';
import ClientDetails from './pages/clients/ClientDetails.jsx';
import Sidebar from './components/Sidebar.jsx';
import Transactions from './pages/Transactions.jsx';
import TransactionsList from './pages/transactions/TransactionsList.jsx';
import TransactionDetails from './pages/transactions/TransactionDetails.jsx';
import Reports from './pages/Reports.jsx';
import TransactionsReport from './pages/reports/TransactionsReport.jsx';
import RevenueReport from './pages/reports/RevenueReport.jsx';
import BalancesReport from './pages/reports/BalancesReport.jsx';
import Admins from './pages/Admins.jsx';
import AdminsList from './pages/admins/AdminsList.jsx';
import AdminDetails from './pages/admins/AdminDetails.jsx';
import Countries from './pages/Countries.jsx';
import CountriesList from './pages/countries/CountriesList.jsx';
import CountryDetails from './pages/countries/CountryDetails.jsx';
import Login from './pages/Login.jsx';
import Support from './pages/Support.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

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
          <Route path='/' element={
            <ProtectedRoute requiredPermission="clientManagementEnabled">
              <Clients/>
            </ProtectedRoute>
          }>
            <Route index element={<ClientsList/>}/>
            <Route path=':clientId' element={<ClientDetails/>}/>
          </Route>
          <Route path='/clients' element={
            <ProtectedRoute requiredPermission="clientManagementEnabled">
              <Clients/>
            </ProtectedRoute>
          }>
            <Route index element={<ClientsList/>}/>
            <Route path=':clientId' element={<ClientDetails/>}/>
          </Route>
          <Route path='/transactions' element={
            <ProtectedRoute requiredPermission="transactionsEnabled">
              <Transactions/>
            </ProtectedRoute>
          }>
            <Route index element={<TransactionsList/>}/>
            <Route path=':transactionId' element={<TransactionDetails/>}/>
          </Route>
          <Route path='/reports' element={
            <ProtectedRoute requiredPermission="reportsEnabled">
              <Reports/>
            </ProtectedRoute>
          }>
            <Route index element={<TransactionsReport/>}/>
            <Route path='transactions' element={<TransactionsReport/>}/>
            <Route path='revenue' element={<RevenueReport/>}/>
            <Route path='balances' element={<BalancesReport/>}/>
          </Route>
          <Route path='/admins' element={
            <ProtectedRoute requiredPermission="administrationEnabled">
              <Admins/>
            </ProtectedRoute>
          }>
            <Route index element={<AdminsList/>}/>
            <Route path=':adminId' element={<AdminDetails/>}/>
          </Route>
          <Route path='/countries' element={<Countries/>}>
            <Route index element={<CountriesList/>}/>
            <Route path=':countryId' element={<CountryDetails/>}/>
          </Route>
          <Route path='/support' element={
            <ProtectedRoute requiredPermission="clientManagementEnabled">
              <Support/>
            </ProtectedRoute>
          }/>
        </Routes>
      </div>
    </div>
  )
  }

  
}

export default App
