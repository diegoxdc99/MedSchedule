import { create } from 'zustand'
import { type Dose, type DurationType, type ScheduleInput, generateSchedule } from '../utils/doseCalculator'

export interface ScheduleState {
    // Form state
    medicationName: string
    patientName: string
    startDate: string
    startTime: string
    intervalHours: number
    durationType: DurationType
    durationValue: number

    // Generated doses
    doses: Dose[]

    // Settings
    use24h: boolean
    theme: 'light' | 'dark'
    language: 'en' | 'es'

    // Actions
    setMedicationName: (name: string) => void
    setPatientName: (name: string) => void
    setStartDate: (date: string) => void
    setStartTime: (time: string) => void
    setIntervalHours: (hours: number) => void
    setDurationType: (type: DurationType) => void
    setDurationValue: (value: number) => void
    generateDoses: () => void
    toggleDoseTaken: (id: string) => void
    addManualDose: () => void
    removeLastDose: () => void
    setUse24h: (use24h: boolean) => void
    setTheme: (theme: 'light' | 'dark') => void
    setLanguage: (language: 'en' | 'es') => void
}

function getInitialTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light'
    const saved = localStorage.getItem('medschedule-theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialUse24h(): boolean {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('medschedule-use24h')
    if (saved !== null) return saved === 'true'
    return false
}

function getInitialLanguage(): 'en' | 'es' {
    if (typeof window === 'undefined') return 'en'
    const saved = localStorage.getItem('medschedule-lang')
    if (saved === 'en' || saved === 'es') return saved
    return 'en'
}

function getTodayDate(): string {
    const now = new Date()
    const y = now.getFullYear()
    const m = (now.getMonth() + 1).toString().padStart(2, '0')
    const d = now.getDate().toString().padStart(2, '0')
    return `${y}-${m}-${d}`
}

function getCurrentTime(): string {
    const now = new Date()
    const h = now.getHours().toString().padStart(2, '0')
    const m = now.getMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
    // Form defaults
    medicationName: '',
    patientName: '',
    startDate: getTodayDate(),
    startTime: getCurrentTime(),
    intervalHours: 8,
    durationType: 'days',
    durationValue: 5,

    // Empty until generated
    doses: [],

    // Settings
    use24h: getInitialUse24h(),
    theme: getInitialTheme(),
    language: getInitialLanguage(),

    // Setters
    setMedicationName: (name) => set({ medicationName: name }),
    setPatientName: (name) => set({ patientName: name }),
    setStartDate: (date) => set({ startDate: date }),
    setStartTime: (time) => set({ startTime: time }),
    setIntervalHours: (hours) => set({ intervalHours: hours }),
    setDurationType: (type) => set({ durationType: type }),
    setDurationValue: (value) => set({ durationValue: value }),

    generateDoses: () => {
        const state = get()
        const input: ScheduleInput = {
            startDate: state.startDate,
            startTime: state.startTime,
            intervalHours: state.intervalHours,
            durationType: state.durationType,
            durationValue: state.durationValue,
        }
        const doses = generateSchedule(input)
        set({ doses })
    },

    toggleDoseTaken: (id) => {
        set((state) => ({
            doses: state.doses.map((dose) =>
                dose.id === id ? { ...dose, taken: !dose.taken } : dose
            ),
        }))
    },

    addManualDose: () => {
        set((state) => {
            const lastDose = state.doses[state.doses.length - 1]
            const newDateTime = lastDose
                ? new Date(lastDose.dateTime.getTime() + state.intervalHours * 60 * 60 * 1000)
                : new Date()

            const newDose: Dose = {
                id: `dose-${state.doses.length + 1}`,
                number: state.doses.length + 1,
                dateTime: newDateTime,
                taken: false,
            }

            return { doses: [...state.doses, newDose] }
        })
    },

    removeLastDose: () => {
        set((state) => ({
            doses: state.doses.slice(0, -1),
        }))
    },

    setUse24h: (use24h) => {
        localStorage.setItem('medschedule-use24h', String(use24h))
        set({ use24h })
    },

    setTheme: (theme) => {
        localStorage.setItem('medschedule-theme', theme)
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        set({ theme })
    },

    setLanguage: (language) => {
        localStorage.setItem('medschedule-lang', language)
        set({ language })
    },
}))
