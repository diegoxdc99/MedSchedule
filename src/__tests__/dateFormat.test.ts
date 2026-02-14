import { describe, it, expect } from 'vitest'
import { formatDate, formatTime, formatDateForPdf, formatTimeForPdf, formatEstimatedEnd } from '../utils/dateFormat'

describe('dateFormat', () => {
    const date = new Date(2024, 0, 15, 14, 30, 0) // Jan 15, 2024 2:30 PM

    describe('formatDate', () => {
        it('should format date in English', () => {
            const result = formatDate(date, 'en')
            expect(result).toContain('Jan')
            expect(result).toContain('15')
            expect(result).toContain('2024')
        })

        it('should format date in Spanish', () => {
            const result = formatDate(date, 'es')
            expect(result).toContain('ene')
            expect(result).toContain('15')
            expect(result).toContain('2024')
        })
    })

    describe('formatTime', () => {
        it('should format time in 12h format', () => {
            const result = formatTime(date, false)
            expect(result).toContain('02:30')
            expect(result.toLowerCase()).toContain('pm')
        })

        it('should format time in 24h format', () => {
            const result = formatTime(date, true)
            expect(result).toBe('14:30')
        })

        it('should format AM times correctly in 12h', () => {
            const morning = new Date(2024, 0, 15, 8, 0, 0)
            const result = formatTime(morning, false)
            expect(result).toContain('08:00')
            expect(result.toLowerCase()).toContain('am')
        })
    })

    describe('formatDateForPdf', () => {
        it('should format date for PDF (English)', () => {
            const result = formatDateForPdf(date, 'en')
            expect(result).toContain('Jan')
            expect(result).toContain('15')
        })

        it('should format date for PDF (Spanish)', () => {
            const result = formatDateForPdf(date, 'es')
            expect(result).toContain('ene')
        })
    })

    describe('formatTimeForPdf', () => {
        it('should format time for PDF in 24h', () => {
            const result = formatTimeForPdf(date, true)
            expect(result).toBe('14:30')
        })

        it('should format time for PDF in 12h', () => {
            const result = formatTimeForPdf(date, false)
            expect(result.toLowerCase()).toContain('pm')
        })
    })

    describe('formatEstimatedEnd', () => {
        it('should format estimated end date in English', () => {
            const result = formatEstimatedEnd(date, 'en')
            expect(result).toContain('Jan')
            expect(result).toContain('15')
        })

        it('should format estimated end date in Spanish', () => {
            const result = formatEstimatedEnd(date, 'es')
            expect(result).toContain('ene')
        })
    })
})
