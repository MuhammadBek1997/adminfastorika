import { useState } from 'react'
import '../styles/Login.css'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../context'
import { AlertCircle, ChevronDown, Eye, EyeClosed, Moon, Sun } from 'lucide-react'

const Login = () => {

    let { t, theme, currentLang, toggleTheme, languages, currentLanguage, handleChange, handleLogin} = useGlobalContext()

    const [themeOpen, setThemeOpen] = useState(false)
    const [langOpen, setLangOpen] = useState(false)
    const [isShowPsw, setIsShowPsw] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false)



    return (
        <div className='login-admin' style={{
            width: '100vw',
            height: '100vh'
        }}>
            <nav className='login-navbar'>
                <button className='logo'>
                    <img src={`/images/logo${theme}.svg`} alt="" />
                </button>
                <div className="dropdowns-cont" style={{ top: "1rem" }}>
                    {/* Theme Dropdown */}
                    <div className="themeDropdown">
                        <button
                            onClick={() => {
                                setThemeOpen(!themeOpen)
                                setLangOpen(false)
                            }}
                            className="themeToggle"
                            aria-label="Theme menu"
                        >
                            {theme === 'light' ? (
                                <Sun/>
                            ) : (
                                <Moon/>
                            )}
                            <ChevronDown/>
                        </button>

                        {themeOpen && (
                            <div className="themeDropdownMenu">
                                <button
                                    onClick={() => {
                                        if (theme !== 'light') toggleTheme()
                                        setThemeOpen(false)
                                    }}
                                    className={`themeOption ${theme === 'light' ? 'active' : ''}`}
                                >
                                    <Sun/>
                                    <span>{t('theme.light') || 'Light'}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        if (theme !== 'dark') toggleTheme()
                                        setThemeOpen(false)
                                    }}
                                    className={`themeOption ${theme === 'dark' ? 'active' : ''}`}
                                >
                                    <Moon/>
                                    <span>{t('theme.dark') || 'Dark'}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Language Dropdown */}
                    <div className="langDropdown">
                        <button
                            onClick={() => {
                                setLangOpen(!langOpen)
                                setThemeOpen(false)
                            }}
                            className="langToggle"
                            aria-label="Language menu"
                        >
                            <img src={currentLang.flag} alt="" className="langImg" />
                            <span className="langCode">{currentLang.code.toUpperCase()}</span>
                            <ChevronDown/>
                        </button>

                        {langOpen && (
                            <div className="langDropdownMenu">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            handleChange(lang.code)
                                            setLangOpen(false)
                                        }}
                                        className={`langOption ${currentLanguage === lang.code ? 'active' : ''}`}
                                    >
                                        <img src={lang.flag} alt="" className="langImg" />
                                        <span>{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <div className='login-cont'>
                <h1>
                    {t("login-client")}
                </h1>
                <div className='login-cont-form'>
                    <label htmlFor="">
                        {t("login-clientForm1")}
                    </label>
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    <label htmlFor="">
                        {t("login-clientForm2")}
                    </label>
                    <div className='login-cont-form-psw'>
                        <input type={isShowPsw ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} />
                        {isShowPsw ? <Eye className='login-cont-form-psw-img' onClick={() => setIsShowPsw(!isShowPsw)}/> : <EyeClosed className='login-cont-form-psw-img' onClick={() => setIsShowPsw(!isShowPsw)}/>}
                        {/* <img src={!isShowPsw ? `/images/visible${theme}.png` : `/images/hide${theme}.png`} alt="" onClick={() => setIsShowPsw(!isShowPsw)} /> */}
                    </div>
                </div>
                <div className='login-forgot'>
                    <AlertCircle/>
                    {t("login-forgot")}
                </div>
                <button className='login-clientBtn' onClick={()=>handleLogin(email, password)}>
                    {t("login")}
                </button>
            </div>
        </div>
    )
}

export default Login
