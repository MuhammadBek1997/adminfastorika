import { useState, useEffect, useMemo } from 'react';
import { AppContext } from './context.js';
import { useTranslation } from 'react-i18next';
import { fetchUsers } from './api.js';
import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';


export const AppProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = localStorage.getItem("i18nextLng")
  const handleChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  }
  
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });
  const token = localStorage.getItem("token") || ""

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth,setSidebarWidth] = useState("280px")

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState(null)



  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      sidebarCollapsed ? '80px' : '280px'
    )
  }, [sidebarCollapsed])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Fastorika-style language list
  const languages = useMemo(() => ([
    { code: 'ru', name: 'Русский', flag: 'https://img.icons8.com/color/96/russian-federation-circular.png' },
    { code: 'en', name: 'English', flag: 'https://img.icons8.com/color/96/usa-circular.png' },
  ]), [])

  const currentLang = useMemo(() => {
    const code2 = (currentLanguage || 'en').slice(0, 2)
    return languages.find(l => l.code === code2) || languages[1]
  }, [currentLanguage, languages])


  // Minimal auth handlers for previewing Login page
  const cancelLogin = () => {
    window.location.assign('/');
  }

  const handleLogin = async () => {
    localStorage.setItem('adminlog', 'true');
    window.location.assign('/');
    return true;
  }

  const loadUsers = async (page = 0, size = 10) => {
    setUsersLoading(true)
    setUsersError(null)
    try {
      const data = await fetchUsers(page, size)
      setUsers(data)
    } catch (e) {
      setUsersError(e?.message || 'Error')
    } finally {
      setUsersLoading(false)
    }
  }

  





  return (
    <AppContext.Provider value={{ theme,
     toggleTheme,
      handleChange,
       currentLanguage,
       t, languages,
       currentLang, cancelLogin, handleLogin,
       token,
       users, usersLoading, usersError, loadUsers,
       sidebarCollapsed, setSidebarCollapsed,
       sidebarWidth,setSidebarWidth
       }}>
      {children}
    </AppContext.Provider>
  );
};
