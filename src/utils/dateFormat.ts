import { format } from 'date-fns'
import { es, enUS } from 'date-fns/locale'

/**
 * Format a date to a localized date string.
 */
export function formatDate(date: Date, language: string): string {
    const locale = language === 'es' ? es : enUS
    return format(date, 'MMM dd, yyyy', { locale })
}

/**
 * Format a time to 12h or 24h format.
 */
export function formatTime(date: Date, use24h: boolean): string {
    if (use24h) {
        return format(date, 'HH:mm')
    }
    return format(date, 'hh:mm a')
}

/**
 * Format date for PDF display.
 */
export function formatDateForPdf(date: Date, language: string): string {
    const locale = language === 'es' ? es : enUS
    return format(date, 'MMM dd, yyyy', { locale })
}

/**
 * Format time for PDF display.
 */
export function formatTimeForPdf(date: Date, use24h: boolean): string {
    return formatTime(date, use24h)
}

/**
 * Format the estimated end date for display.
 */
export function formatEstimatedEnd(date: Date, language: string): string {
    const locale = language === 'es' ? es : enUS
    return format(date, "MMM dd, hh:mm a", { locale })
}
