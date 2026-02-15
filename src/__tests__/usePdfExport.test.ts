import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePdfExport } from '../hooks/usePdfExport'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

// Mock dependencies
vi.mock('html2canvas', () => ({
    default: vi.fn(() => Promise.resolve({
        toDataURL: () => 'data:image/png;base64,fake',
        height: 100,
        width: 100,
    })),
}))

vi.mock('jspdf', () => {
    const MockJsPDF = vi.fn()
    MockJsPDF.prototype = {
        internal: {
            pageSize: {
                getWidth: () => 210,
            },
        },
        addImage: vi.fn(),
        addPage: vi.fn(),
        save: vi.fn(),
    }
    return { jsPDF: MockJsPDF }
})

describe('usePdfExport', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should initialize with default state', () => {
        const { result } = renderHook(() => usePdfExport())
        expect(result.current.isGenerating).toBe(false)
        expect(result.current.error).toBe(null)
    })

    it('should generate PDF successfully', async () => {
        const { result } = renderHook(() => usePdfExport())
        const mockElement = document.createElement('div')
        const mockSheet = document.createElement('div')
        mockSheet.className = 'print-sheet'
        mockElement.appendChild(mockSheet)

        await act(async () => {
            await result.current.exportPdf(mockElement, 'test-file')
        })

        expect(html2canvas).toHaveBeenCalled()
        expect(jsPDF).toHaveBeenCalled()
        expect(result.current.isGenerating).toBe(false)
        expect(result.current.error).toBe(null)
    })

    it('should handle errors gracefully', async () => {
        const { result } = renderHook(() => usePdfExport())
        const mockElement = document.createElement('div')

        // Force error
        vi.mocked(html2canvas).mockRejectedValueOnce(new Error('Canvas failed'))

        await act(async () => {
            await result.current.exportPdf(mockElement)
        })

        expect(result.current.error).toBe('Canvas failed')
        expect(result.current.isGenerating).toBe(false)
    })
})
