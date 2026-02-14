import { useTranslation } from 'react-i18next'
import { useScheduleStore } from '../store/useScheduleStore'

export default function Navbar() {
    const { t } = useTranslation()
    const { theme, setTheme, use24h, setUse24h, language, setLanguage } = useScheduleStore()

    const handleLanguage = (lang: 'en' | 'es') => {
        setLanguage(lang)
        import('../i18n').then(({ default: i18n }) => {
            i18n.changeLanguage(lang)
        })
    }

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-surface-dark/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-soft dark:shadow-dark-soft no-print transition-colors duration-300">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-glow">
                            <span className="material-icons-round text-xl">medication</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            {t('app.title')}{' '}
                            <span className="text-primary">{t('app.titleAccent')}</span>
                        </span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        {/* Language Toggle */}
                        <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-transparent dark:border-slate-700">
                            <button
                                onClick={() => handleLanguage('en')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${language === 'en'
                                        ? 'bg-white dark:bg-slate-700 shadow-sm text-primary'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                                data-testid="lang-en"
                            >
                                EN
                            </button>
                            <button
                                onClick={() => handleLanguage('es')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ${language === 'es'
                                        ? 'bg-white dark:bg-slate-700 shadow-sm text-primary'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                                data-testid="lang-es"
                            >
                                ES
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block" />

                        {/* Time Format Toggle */}
                        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark cursor-pointer select-none">
                            <span className={!use24h ? 'text-primary font-bold' : ''}>{t('nav.timeFormat12')}</span>
                            <button
                                onClick={() => setUse24h(!use24h)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${use24h ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                                    }`}
                                role="switch"
                                aria-checked={use24h}
                                data-testid="time-toggle"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${use24h ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className={use24h ? 'text-primary font-bold' : ''}>{t('nav.timeFormat24')}</span>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors duration-200"
                            data-testid="theme-toggle"
                            aria-label="Toggle theme"
                        >
                            <span className="material-icons-round">
                                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
