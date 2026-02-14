import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

vi.mock('../i18n', () => ({ default: {} }))

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const map: Record<string, string> = {
                'app.title': 'MedSchedule',
                'app.titleAccent': 'Pro',
                'nav.timeFormat12': '12h',
                'nav.timeFormat24': '24h',
                'config.heading': 'Configure Schedule',
                'config.description': 'Define params.',
                'config.sectionPatient': 'Patient & Drug',
                'config.sectionFrequency': 'Frequency',
                'config.sectionDuration': 'Duration',
                'config.medicationName': 'Medication Name',
                'config.medicationPlaceholder': 'e.g. Med',
                'config.patientName': 'Patient Name',
                'config.patientOptional': '(Optional)',
                'config.patientPlaceholder': 'e.g. Name',
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
                'schedule.heading': 'Medication Schedule',
                'schedule.forPatient': 'For:',
                'schedule.columnNumber': '#',
                'schedule.columnDate': 'Date',
                'schedule.columnTime': 'Time',
                'schedule.columnStatus': 'Status',
                'schedule.columnActions': 'Actions',
                'schedule.removeLast': 'Remove Last',
                'schedule.exportCalendar': 'Export to Calendar',
                'schedule.printPdf': 'Print / PDF',
                'schedule.addDose': 'Add Dose',
            }
            return map[key] ?? key
        },
    }),
}))

describe('App', () => {
    it('should render the application', () => {
        render(<App />)
        expect(screen.getByText('MedSchedule')).toBeInTheDocument()
        expect(screen.getByText('Pro')).toBeInTheDocument()
    })

    it('should render navbar', () => {
        render(<App />)
        expect(screen.getByText('12h')).toBeInTheDocument()
        expect(screen.getByText('24h')).toBeInTheDocument()
    })

    it('should render config panel', () => {
        render(<App />)
        expect(screen.getByText('Configure Schedule')).toBeInTheDocument()
    })

    it('should render schedule table', () => {
        render(<App />)
        expect(screen.getByText('Medication Schedule')).toBeInTheDocument()
    })
})
