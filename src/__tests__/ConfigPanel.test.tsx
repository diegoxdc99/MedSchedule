import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfigPanel from '../components/ConfigPanel'

const mockGenerateDoses = vi.fn()
const mockSetMedicationName = vi.fn()
const mockSetPatientName = vi.fn()
const mockSetStartDate = vi.fn()
const mockSetStartTime = vi.fn()
const mockSetIntervalHours = vi.fn()
const mockSetDurationType = vi.fn()
const mockSetDurationValue = vi.fn()

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const map: Record<string, string> = {
                'config.heading': 'Configure Schedule',
                'config.description': 'Define the medication parameters.',
                'config.sectionPatient': 'Patient & Drug',
                'config.sectionFrequency': 'Frequency',
                'config.sectionDuration': 'Duration',
                'config.medicationName': 'Medication Name',
                'config.medicationPlaceholder': 'e.g. Amoxicillin',
                'config.patientName': 'Patient Name',
                'config.patientOptional': '(Optional)',
                'config.patientPlaceholder': 'e.g. John',
                'config.startDate': 'Start Date',
                'config.startTime': 'Start Time',
                'config.repeatEvery': 'Repeat Every',
                'config.hoursUnit': 'Hours',
                'config.byDays': 'By Days',
                'config.byQuantity': 'By Quantity',
                'config.daysTotal': 'Days total',
                'config.dosesTotal': 'Doses total',
                'config.generateSchedule': 'Generate Schedule',
                'config.estimatedEnd': 'Estimated End',
            }
            return map[key] ?? key
        },
    }),
}))

let storeState: {
    medicationName: string
    setMedicationName: typeof mockSetMedicationName
    patientName: string
    setPatientName: typeof mockSetPatientName
    startDate: string
    setStartDate: typeof mockSetStartDate
    startTime: string
    setStartTime: typeof mockSetStartTime
    intervalHours: number
    setIntervalHours: typeof mockSetIntervalHours
    durationType: 'days' | 'quantity'
    setDurationType: typeof mockSetDurationType
    durationValue: number
    setDurationValue: typeof mockSetDurationValue
    generateDoses: typeof mockGenerateDoses
    language: string
} = {
    medicationName: 'Amoxicillin',
    setMedicationName: mockSetMedicationName,
    patientName: 'John',
    setPatientName: mockSetPatientName,
    startDate: '2024-01-15',
    setStartDate: mockSetStartDate,
    startTime: '08:00',
    setStartTime: mockSetStartTime,
    intervalHours: 8,
    setIntervalHours: mockSetIntervalHours,
    durationType: 'days' as const,
    setDurationType: mockSetDurationType,
    durationValue: 5,
    setDurationValue: mockSetDurationValue,
    generateDoses: mockGenerateDoses,
    language: 'en',
}

vi.mock('../store/useScheduleStore', () => ({
    useScheduleStore: vi.fn((selector) => {
        return selector ? selector(storeState) : storeState
    }),
}))

describe('ConfigPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render form with all sections', () => {
        render(<ConfigPanel />)
        expect(screen.getByText('Configure Schedule')).toBeInTheDocument()
        expect(screen.getByText('Patient & Drug')).toBeInTheDocument()
        expect(screen.getByText('Frequency')).toBeInTheDocument()
        expect(screen.getByText('Duration')).toBeInTheDocument()
    })

    it('should render medication input with value', () => {
        render(<ConfigPanel />)
        const input = screen.getByTestId('medication-name') as HTMLInputElement
        expect(input.value).toBe('Amoxicillin')
    })

    it('should call setMedicationName on input change', () => {
        render(<ConfigPanel />)
        fireEvent.change(screen.getByTestId('medication-name'), { target: { value: 'Ibuprofen' } })
        expect(mockSetMedicationName).toHaveBeenCalledWith('Ibuprofen')
    })

    it('should render patient input with value', () => {
        render(<ConfigPanel />)
        const input = screen.getByTestId('patient-name') as HTMLInputElement
        expect(input.value).toBe('John')
    })

    it('should render date and time inputs', () => {
        render(<ConfigPanel />)
        expect(screen.getByTestId('start-date')).toBeInTheDocument()
        expect(screen.getByTestId('start-time')).toBeInTheDocument()
    })

    it('should render interval input', () => {
        render(<ConfigPanel />)
        const input = screen.getByTestId('interval-hours') as HTMLInputElement
        expect(input.value).toBe('8')
    })

    it('should render duration type radio buttons', () => {
        render(<ConfigPanel />)
        expect(screen.getByTestId('duration-days')).toBeInTheDocument()
        expect(screen.getByTestId('duration-quantity')).toBeInTheDocument()
    })

    it('should call generateDoses on button click', () => {
        render(<ConfigPanel />)
        fireEvent.click(screen.getByTestId('generate-btn'))
        expect(mockGenerateDoses).toHaveBeenCalled()
    })

    it('should show estimated end', () => {
        render(<ConfigPanel />)
        expect(screen.getByText('Estimated End:')).toBeInTheDocument()
    })

    it('should show dosesTotal when quantity mode', () => {
        storeState.durationType = 'quantity'
        render(<ConfigPanel />)
        expect(screen.getByText('Doses total')).toBeInTheDocument()
        storeState.durationType = 'days'
    })
})
