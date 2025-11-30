
import { Route, Routes } from 'react-router-dom';
import './App.css'
import { useGlobalContext } from './context.js'
import Clients from './pages/Clients.jsx';
import Sidebar from './components/Sidebar.jsx';
import Transactions from './pages/Transactions.jsx';
import Reports from './pages/Reports.jsx';
import Admins from './pages/Admins.jsx';
import Login from './pages/Login.jsx';

function App() {
  const { theme} = useGlobalContext();

  

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
      <Routes>
        <Route path='/' element={<Clients/>}/>
        <Route path='/transactions' element={<Transactions/>}/>
        <Route path='/reports' element={<Reports/>}/>
        <Route path='/admins' element={<Admins/>}/>
      </Routes>
    </div>
  )
  }

  
}

export default App
