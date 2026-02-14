import { describe, it, expect, beforeEach } from 'vitest'
import { useScheduleStore } from '../store/useScheduleStore'

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value },
        removeItem: (key: string) => { delete store[key] },
        clear: () => { store = {} },
    }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useScheduleStore', () => {
    beforeEach(() => {
        localStorageMock.clear()
        useScheduleStore.setState({
            medicationName: '',
            patientName: '',
            intervalHours: 8,
            durationType: 'days',
            durationValue: 5,
            doses: [],
            use24h: false,
            theme: 'light',
            language: 'en',
        })
    })

    it('should set medication name', () => {
        useScheduleStore.getState().setMedicationName('Amoxicillin')
        expect(useScheduleStore.getState().medicationName).toBe('Amoxicillin')
    })

    it('should set patient name', () => {
        useScheduleStore.getState().setPatientName('John Doe')
        expect(useScheduleStore.getState().patientName).toBe('John Doe')
    })

    it('should set start date', () => {
        useScheduleStore.getState().setStartDate('2024-06-15')
        expect(useScheduleStore.getState().startDate).toBe('2024-06-15')
    })

    it('should set start time', () => {
        useScheduleStore.getState().setStartTime('14:30')
        expect(useScheduleStore.getState().startTime).toBe('14:30')
    })

    it('should set interval hours', () => {
        useScheduleStore.getState().setIntervalHours(12)
        expect(useScheduleStore.getState().intervalHours).toBe(12)
    })

    it('should set duration type', () => {
        useScheduleStore.getState().setDurationType('quantity')
        expect(useScheduleStore.getState().durationType).toBe('quantity')
    })

    it('should set duration value', () => {
        useScheduleStore.getState().setDurationValue(10)
        expect(useScheduleStore.getState().durationValue).toBe(10)
    })

    it('should generate doses', () => {
        useScheduleStore.setState({
            startDate: '2024-01-15',
            startTime: '08:00',
            intervalHours: 8,
            durationType: 'quantity',
            durationValue: 3,
        })
        useScheduleStore.getState().generateDoses()
        expect(useScheduleStore.getState().doses).toHaveLength(3)
    })

    it('should toggle dose taken status', () => {
        useScheduleStore.setState({
            startDate: '2024-01-15',
            startTime: '08:00',
            intervalHours: 8,
            durationType: 'quantity',
            durationValue: 2,
        })
        useScheduleStore.getState().generateDoses()
        const doseId = useScheduleStore.getState().doses[0].id

        useScheduleStore.getState().toggleDoseTaken(doseId)
        expect(useScheduleStore.getState().doses[0].taken).toBe(true)

        useScheduleStore.getState().toggleDoseTaken(doseId)
        expect(useScheduleStore.getState().doses[0].taken).toBe(false)
    })

    it('should add manual dose at the end', () => {
        useScheduleStore.setState({
            startDate: '2024-01-15',
            startTime: '08:00',
            intervalHours: 8,
            durationType: 'quantity',
            durationValue: 2,
        })
        useScheduleStore.getState().generateDoses()
        expect(useScheduleStore.getState().doses).toHaveLength(2)

        useScheduleStore.getState().addManualDose()
        expect(useScheduleStore.getState().doses).toHaveLength(3)
        expect(useScheduleStore.getState().doses[2].number).toBe(3)
    })

    it('should add manual dose when no doses exist', () => {
        useScheduleStore.getState().addManualDose()
        expect(useScheduleStore.getState().doses).toHaveLength(1)
    })

    it('should remove last dose', () => {
        useScheduleStore.setState({
            startDate: '2024-01-15',
            startTime: '08:00',
            intervalHours: 8,
            durationType: 'quantity',
            durationValue: 3,
        })
        useScheduleStore.getState().generateDoses()
        expect(useScheduleStore.getState().doses).toHaveLength(3)

        useScheduleStore.getState().removeLastDose()
        expect(useScheduleStore.getState().doses).toHaveLength(2)
    })

    it('should handle remove last dose on empty array', () => {
        useScheduleStore.getState().removeLastDose()
        expect(useScheduleStore.getState().doses).toHaveLength(0)
    })

    it('should set 24h time format and persist', () => {
        useScheduleStore.getState().setUse24h(true)
        expect(useScheduleStore.getState().use24h).toBe(true)
        expect(localStorageMock.getItem('medschedule-use24h')).toBe('true')
    })

    it('should set theme and persist', () => {
        useScheduleStore.getState().setTheme('dark')
        expect(useScheduleStore.getState().theme).toBe('dark')
        expect(localStorageMock.getItem('medschedule-theme')).toBe('dark')
        expect(document.documentElement.classList.contains('dark')).toBe(true)

        useScheduleStore.getState().setTheme('light')
        expect(useScheduleStore.getState().theme).toBe('light')
        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should set language and persist', () => {
        useScheduleStore.getState().setLanguage('es')
        expect(useScheduleStore.getState().language).toBe('es')
        expect(localStorageMock.getItem('medschedule-lang')).toBe('es')
    })
})
