import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../components/Navbar'

const mockSetTheme = vi.fn()
const mockSetUse24h = vi.fn()
const mockSetLanguage = vi.fn()
const mockChangeLanguage = vi.fn()

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const map: Record<string, string> = {
                'app.title': 'MedSchedule',
                'app.titleAccent': 'Pro',
                'nav.timeFormat12': '12h',
                'nav.timeFormat24': '24h',
            }
            return map[key] ?? key
        },
    }),
}))

vi.mock('../i18n', () => ({
    default: { changeLanguage: mockChangeLanguage },
}))

let storeState: {
    theme: 'light' | 'dark'
    setTheme: typeof mockSetTheme
    use24h: boolean
    setUse24h: typeof mockSetUse24h
    language: 'en' | 'es'
    setLanguage: typeof mockSetLanguage
} = {
    theme: 'light' as const,
    setTheme: mockSetTheme,
    use24h: false,
    setUse24h: mockSetUse24h,
    language: 'en' as const,
    setLanguage: mockSetLanguage,
}

vi.mock('../store/useScheduleStore', () => ({
    useScheduleStore: vi.fn((selector) => {
        return selector ? selector(storeState) : storeState
    }),
}))

describe('Navbar', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        storeState = {
            theme: 'light',
            setTheme: mockSetTheme,
            use24h: false,
            setUse24h: mockSetUse24h,
            language: 'en',
            setLanguage: mockSetLanguage,
        }
    })

    it('should render logo and title', () => {
        render(<Navbar />)
        expect(screen.getByText('MedSchedule')).toBeInTheDocument()
        expect(screen.getByText('Pro')).toBeInTheDocument()
    })

    it('should render language toggle buttons', () => {
        render(<Navbar />)
        expect(screen.getByTestId('lang-en')).toBeInTheDocument()
        expect(screen.getByTestId('lang-es')).toBeInTheDocument()
    })

    it('should call setLanguage when language button clicked', () => {
        render(<Navbar />)
        fireEvent.click(screen.getByTestId('lang-es'))
        expect(mockSetLanguage).toHaveBeenCalledWith('es')
    })

    it('should render time format toggle', () => {
        render(<Navbar />)
        expect(screen.getByTestId('time-toggle')).toBeInTheDocument()
        expect(screen.getByText('12h')).toBeInTheDocument()
        expect(screen.getByText('24h')).toBeInTheDocument()
    })

    it('should call setUse24h when time toggle clicked', () => {
        render(<Navbar />)
        fireEvent.click(screen.getByTestId('time-toggle'))
        expect(mockSetUse24h).toHaveBeenCalledWith(true)
    })

    it('should render theme toggle', () => {
        render(<Navbar />)
        expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    })

    it('should call setTheme when theme button clicked', () => {
        render(<Navbar />)
        fireEvent.click(screen.getByTestId('theme-toggle'))
        expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('should show light_mode icon when in dark theme', () => {
        storeState.theme = 'dark'
        render(<Navbar />)
        expect(screen.getByText('light_mode')).toBeInTheDocument()
    })

    it('should show dark_mode icon when in light theme', () => {
        render(<Navbar />)
        expect(screen.getByText('dark_mode')).toBeInTheDocument()
    })
})
