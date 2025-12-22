import { useState, useEffect, useMemo } from 'react';
import { AppContext } from './context.js';
import { useTranslation } from 'react-i18next';
import { fetchUsers } from './api.js';


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

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState === 'true';
  })
  const [sidebarWidth,setSidebarWidth] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState === 'true' ? '80px' : '280px';
  })

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
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed)
  }, [sidebarCollapsed])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Fastorika-style language list
  const languages = useMemo(() => ([
    { code: 'ru', name: t('language.russian'), flag: 'https://img.icons8.com/color/96/russian-federation-circular.png' },
    { code: 'en', name: t('language.english'), flag: 'https://img.icons8.com/color/96/usa-circular.png' },
  ]), [t])

  const currentLang = useMemo(() => {
    const code2 = (currentLanguage || 'en').slice(0, 2)
    return languages.find(l => l.code === code2) || languages[1]
  }, [currentLanguage, languages])


  // Admin login handler
  const cancelLogin = () => {
    window.location.assign('/');
  }

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const responseData = await res.json();

      if (!res.ok) {
        alert(responseData.message || 'Login failed');
        return false;
      }

      const { data, success, message } = responseData;

      if (!success || !data) {
        alert(message || 'Login failed');
        return false;
      }

      // Extract tokens and admin data
      const { accessToken, refreshToken, user: adminData } = data;

      // Store tokens and admin info
      sessionStorage.setItem('token', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('adminlog', 'true');
      localStorage.setItem('adminRole', adminData.role); // ADMIN or SUPER_ADMIN
      localStorage.setItem('adminEmail', adminData.email);
      localStorage.setItem('adminId', adminData.id); // Store admin ID for permissions

      console.log('Login successful:', { role: adminData.role, email: adminData.email, id: adminData.id });

      window.location.assign('/');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      alert('Network error');
      return false;
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    localStorage.removeItem('adminlog');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminId');
    window.location.assign('/login');
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
       currentLang, cancelLogin, handleLogin, handleLogout,
       token,
       users, usersLoading, usersError, loadUsers,
       sidebarCollapsed, setSidebarCollapsed,
       sidebarWidth,setSidebarWidth
       }}>
      {children}
    </AppContext.Provider>
  );
};
