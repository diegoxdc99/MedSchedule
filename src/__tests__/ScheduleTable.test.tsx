import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { ScheduleTable } from '../components/ScheduleTable'
import { type Dose } from '../utils/doseCalculator'

const mockRemoveLastDose = vi.fn()
const mockAddManualDose = vi.fn()

const testDoses: Dose[] = [
    { id: 'dose-1', number: 1, dateTime: new Date(2024, 0, 15, 8, 0), taken: false },
    { id: 'dose-2', number: 2, dateTime: new Date(2024, 0, 15, 16, 0), taken: true },
]

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const map: Record<string, string> = {
                'schedule.heading': 'Medication Schedule',
                'schedule.columnNumber': '#',
                'schedule.columnDate': 'Date',
                'schedule.columnTime': 'Time',
                'schedule.columnStatus': 'Status',
                'schedule.columnActions': 'Actions',
                'schedule.removeLast': 'Remove Last',
                'schedule.addDose': 'Add Dose',
                'schedule.downloadIcs': 'Download ICS',
                'schedule.printPdf': 'Print PDF',
                'config.description': 'Generate your schedule',
                'schedule.forPatient': 'for',
                'config.repeatEvery': 'Every',
                'config.hoursUnit': 'hours',
                'print.title': 'Print Schedule',
                'print.subtitle': 'Print Subtitle',
                'print.patient': 'Print Patient',
                'print.prescription': 'Print Prescription',
                'print.stayHealthy': 'Print Healthy',
                'print.done': 'Print Done',
                'print.date': 'Print Date',
                'print.time': 'Print Time',
                'print.columnNumber': 'Print #',
            }
            return map[key] ?? key
        },
        i18n: { language: 'en' },
    }),
}))

const storeState = {
    doses: testDoses,
    medicationName: 'Amoxicillin',
    patientName: 'John',
    removeLastDose: mockRemoveLastDose,
    addManualDose: mockAddManualDose,
    use24h: false,
    language: 'en',
    toggleDoseTaken: vi.fn(),
    prescriptionDetails: 'Every 8 hours',
    intervalHours: 8,
}

vi.mock('../store/useScheduleStore', () => ({
    useScheduleStore: vi.fn((selector) => {
        return selector ? selector(storeState) : storeState
    }),
}))

vi.mock('../utils/calendarExport', () => ({
    openGoogleCalendar: vi.fn(),
    openOutlookCalendar: vi.fn(),
    downloadIcsFile: vi.fn(),
}))

vi.mock('../hooks/usePdfExport', () => ({
    usePdfExport: () => ({
        exportPdf: vi.fn(),
        isGenerating: false,
        error: null,
    }),
}))

describe('ScheduleTable', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        storeState.doses = testDoses
    })

    it('should render heading', () => {
        render(<ScheduleTable />)
        expect(screen.getByText('Medication Schedule')).toBeInTheDocument()
    })

    it('should show medication and patient info', () => {
        render(<ScheduleTable />)
        const header = screen.getByTestId('schedule-header')
        expect(within(header).getByText('Amoxicillin')).toBeInTheDocument()
        expect(within(header).getByText(/John/)).toBeInTheDocument()
    })

    it('should render table columns', () => {
        render(<ScheduleTable />)
        expect(screen.getByText('#')).toBeInTheDocument()
        expect(screen.getByText('Date')).toBeInTheDocument()
        expect(screen.getByText('Time')).toBeInTheDocument()
        expect(screen.getByText('Status')).toBeInTheDocument()
    })

    it('should render remove last button', () => {
        render(<ScheduleTable />)
        expect(screen.getByTestId('remove-last')).toBeInTheDocument()
    })

    it('should call removeLastDose when clicked', () => {
        render(<ScheduleTable />)
        fireEvent.click(screen.getByTestId('remove-last'))
        expect(mockRemoveLastDose).toHaveBeenCalled()
    })

    it('should render add dose button', () => {
        render(<ScheduleTable />)
        expect(screen.getByTestId('add-dose')).toBeInTheDocument()
    })

    it('should call addManualDose when add button clicked', () => {
        render(<ScheduleTable />)
        fireEvent.click(screen.getByTestId('add-dose'))
        expect(mockAddManualDose).toHaveBeenCalled()
    })

    it('should show empty state when no doses', () => {
        storeState.doses = []
        render(<ScheduleTable />)
        expect(screen.getByText('Generate your schedule')).toBeInTheDocument()
    })

    it('should render export calendar button', () => {
        render(<ScheduleTable />)
        expect(screen.getByTestId('calendar-export-btn')).toBeInTheDocument()
    })

    it('should render print/pdf button', () => {
        render(<ScheduleTable />)
        expect(screen.getByTestId('print-pdf-btn')).toBeInTheDocument()
    })

    it.skip('should open print dialog when print button clicked', async () => {
        render(<ScheduleTable />)
        fireEvent.click(screen.getByTestId('print-pdf-btn'))
        expect(await screen.findByText('PDF Export')).toBeInTheDocument()
    })

    it('should render dose rows for each dose', () => {
        render(<ScheduleTable />)
        expect(screen.getByTestId('dose-row-1')).toBeInTheDocument()
        expect(screen.getByTestId('dose-row-2')).toBeInTheDocument()
    })
})
