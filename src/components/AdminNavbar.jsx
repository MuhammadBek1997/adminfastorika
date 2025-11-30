import { useState } from 'react'
import { ChevronDown, Moon, Sun } from 'lucide-react'
import { useGlobalContext } from '../context'

const AdminNavbar = () => {
  let { theme, toggleTheme, currentLanguage, handleChange, t, currentLang, languages } = useGlobalContext()
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  return (
    <div className='admin-navbar'>
      <div className="dropdowns-cont">
        {/* Theme Dropdown */}
        <div className="themeDropdown">
          <button
            onClick={() => { setIsThemeOpen(!isThemeOpen); setIsLangOpen(false) }}
            className="themeToggle"
            aria-label="Theme menu"
          >
            {theme === 'light' ? (
              <Sun />
            ) : (
              <Moon />
            )}
            <ChevronDown />
          </button>

          {isThemeOpen && (
            <div className="themeDropdownMenu">
              <button
                onClick={() => { if (theme !== 'light') toggleTheme(); setIsThemeOpen(false) }}
                className={`themeOption ${theme === 'light' ? 'active' : ''}`}
              >
                <Sun />
                <span>{t ? t('theme.light') : 'Light'}</span>
              </button>
              <button
                onClick={() => { if (theme !== 'dark') toggleTheme(); setIsThemeOpen(false) }}
                className={`themeOption ${theme === 'dark' ? 'active' : ''}`}
              >
                <Moon />
                <span>{t ? t('theme.dark') : 'Dark'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Language Dropdown */}
        <div className="langDropdown">
          <button
            onClick={() => { setIsLangOpen(!isLangOpen); setIsThemeOpen(false) }}
            className="langToggle"
            aria-label="Language menu"
          >
            {currentLang?.img ? (
              <img src={currentLang.img} alt="" className="langImg" />
            ) : (
              <span className="langFlag" aria-hidden>
                <img src={currentLang.flag} alt="" className="langImg" />
              </span>
            )}
            <span className="langCode">{(currentLang?.code || (currentLanguage || 'en')).slice(0, 2).toUpperCase()}</span>
            <ChevronDown />
          </button>

          {isLangOpen && (
            <div className="langDropdownMenu">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { handleChange(lang.code); setIsLangOpen(false) }}
                  className={`langOption ${currentLanguage?.startsWith(lang.code) ? 'active' : ''}`}
                >
                  {lang.img ? (
                    <img src={lang.img} alt="" className="langImg" />
                  ) : (
                    <img src={lang.flag} alt="" className="langImg" />
                  )}
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminNavbar

