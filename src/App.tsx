import { useEffect } from 'react'
import './i18n'
import './index.css'
import Navbar from './components/Navbar'
import ConfigPanel from './components/ConfigPanel'
import ScheduleTable from './components/ScheduleTable'
import BackgroundDecoration from './components/BackgroundDecoration'
import { useScheduleStore } from './store/useScheduleStore'

export default function App() {
  const theme = useScheduleStore((s) => s.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div
      className={`bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-display min-h-screen flex flex-col antialiased transition-colors duration-300`}
    >
      <Navbar />

      <main className="flex-grow p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <ConfigPanel />
        <ScheduleTable />
      </main>

      <BackgroundDecoration />
    </div>
  )
}
