import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DoseRow from '../components/DoseRow'
import { type Dose } from '../utils/doseCalculator'

// Mock i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const map: Record<string, string> = {
                'schedule.taken': 'Taken',
                'schedule.pending': 'Pending',
            }
            return map[key] ?? key
        },
    }),
}))

// Mock the store
vi.mock('../store/useScheduleStore', () => ({
    useScheduleStore: vi.fn((selector) => {
        const state = {
            use24h: false,
            language: 'en',
            toggleDoseTaken: vi.fn(),
        }
        return selector ? selector(state) : state
    }),
}))

describe('DoseRow', () => {
    const pendingDose: Dose = {
        id: 'dose-1',
        number: 1,
        dateTime: new Date(2024, 0, 15, 8, 0, 0),
        taken: false,
    }

    const takenDose: Dose = {
        id: 'dose-2',
        number: 2,
        dateTime: new Date(2024, 0, 15, 16, 0, 0),
        taken: true,
    }

    it('should render pending dose', () => {
        render(<DoseRow dose={pendingDose} index={0} />)
        expect(screen.getByText('Pending')).toBeInTheDocument()
        expect(screen.getByText('01')).toBeInTheDocument()
    })

    it('should render taken dose', () => {
        render(<DoseRow dose={takenDose} index={1} />)
        expect(screen.getByText('Taken')).toBeInTheDocument()
        expect(screen.getByText('02')).toBeInTheDocument()
    })

    it('should have checkbox reflecting taken status', () => {
        render(<DoseRow dose={takenDose} index={0} />)
        const checkbox = screen.getByTestId('dose-checkbox-2')
        expect(checkbox).toBeChecked()
    })

    it('should have unchecked checkbox for pending dose', () => {
        render(<DoseRow dose={pendingDose} index={0} />)
        const checkbox = screen.getByTestId('dose-checkbox-1')
        expect(checkbox).not.toBeChecked()
    })

    it('should apply different time colors based on index', () => {
        const { container: c1 } = render(<DoseRow dose={pendingDose} index={0} />)
        const { container: c2 } = render(<DoseRow dose={pendingDose} index={1} />)
        // Different indices should produce different color classes
        expect(c1.innerHTML).not.toBe(c2.innerHTML)
    })

    it('should render the delete button', () => {
        render(<DoseRow dose={pendingDose} index={0} />)
        expect(screen.getByLabelText('Delete dose')).toBeInTheDocument()
    })
})
