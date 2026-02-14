import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PrintDialog from '../components/PrintDialog'

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const map: Record<string, string> = {
                'pdf.dialogTitle': 'PDF Export Options',
                'pdf.layoutLabel': 'Layout',
                'pdf.oneColumn': '1 Column',
                'pdf.twoColumns': '2 Columns',
                'pdf.cancel': 'Cancel',
                'pdf.export': 'Export PDF',
            }
            return map[key] ?? key
        },
    }),
}))

describe('PrintDialog', () => {
    it('should not render when closed', () => {
        render(
            <PrintDialog open={false} onClose={vi.fn()} onExport={vi.fn()} />
        )
        expect(screen.queryByText('PDF Export Options')).not.toBeInTheDocument()
    })

    it('should render when open', () => {
        render(
            <PrintDialog open={true} onClose={vi.fn()} onExport={vi.fn()} />
        )
        expect(screen.getByText('PDF Export Options')).toBeInTheDocument()
        expect(screen.getByText('1 Column')).toBeInTheDocument()
        expect(screen.getByText('2 Columns')).toBeInTheDocument()
    })

    it('should call onClose when cancel clicked', () => {
        const onClose = vi.fn()
        render(
            <PrintDialog open={true} onClose={onClose} onExport={vi.fn()} />
        )
        fireEvent.click(screen.getByTestId('pdf-cancel'))
        expect(onClose).toHaveBeenCalled()
    })

    it('should call onExport with 1 column by default', () => {
        const onExport = vi.fn()
        render(
            <PrintDialog open={true} onClose={vi.fn()} onExport={onExport} />
        )
        fireEvent.click(screen.getByTestId('pdf-export'))
        expect(onExport).toHaveBeenCalledWith(1)
    })

    it('should call onExport with 2 columns when selected', () => {
        const onExport = vi.fn()
        render(
            <PrintDialog open={true} onClose={vi.fn()} onExport={onExport} />
        )
        fireEvent.click(screen.getByTestId('pdf-2col'))
        fireEvent.click(screen.getByTestId('pdf-export'))
        expect(onExport).toHaveBeenCalledWith(2)
    })

    it('should close when clicking overlay', () => {
        const onClose = vi.fn()
        render(
            <PrintDialog open={true} onClose={onClose} onExport={vi.fn()} />
        )
        fireEvent.click(screen.getByTestId('print-dialog-overlay'))
        expect(onClose).toHaveBeenCalled()
    })

    it('should not close when clicking dialog content', () => {
        const onClose = vi.fn()
        render(
            <PrintDialog open={true} onClose={onClose} onExport={vi.fn()} />
        )
        fireEvent.click(screen.getByTestId('print-dialog'))
        expect(onClose).not.toHaveBeenCalled()
    })
})
