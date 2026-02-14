import { type Dose } from './doseCalculator'
import { formatDateForPdf, formatTimeForPdf } from './dateFormat'

/**
 * Build a Google Calendar event URL.
 */
export function buildGoogleCalendarUrl(
    dose: Dose,
    medicationName: string,
    patientName: string
): string {
    const startDate = formatGoogleDate(dose.dateTime)
    const endDate = formatGoogleDate(new Date(dose.dateTime.getTime() + 15 * 60 * 1000))
    const title = encodeURIComponent(`💊 ${medicationName}`)
    const details = patientName
        ? encodeURIComponent(`Medication: ${medicationName}\nPatient: ${patientName}\nDose #${dose.number}`)
        : encodeURIComponent(`Medication: ${medicationName}\nDose #${dose.number}`)

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`
}

/**
 * Format a Date to Google Calendar URL format (YYYYMMDDTHHmmSSZ).
 */
function formatGoogleDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/**
 * Generate a complete ICS file content for all doses.
 */
export function generateIcsContent(
    doses: Dose[],
    medicationName: string,
    patientName: string
): string {
    const events = doses.map((dose) => {
        const start = formatIcsDate(dose.dateTime)
        const end = formatIcsDate(new Date(dose.dateTime.getTime() + 15 * 60 * 1000))
        const description = patientName
            ? `Medication: ${medicationName}\\nPatient: ${patientName}\\nDose #${dose.number}`
            : `Medication: ${medicationName}\\nDose #${dose.number}`

        return [
            'BEGIN:VEVENT',
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:💊 ${medicationName} - Dose #${dose.number}`,
            `DESCRIPTION:${description}`,
            `UID:medschedule-${dose.id}-${Date.now()}@medschedule`,
            'STATUS:CONFIRMED',
            `BEGIN:VALARM`,
            `TRIGGER:-PT5M`,
            `ACTION:DISPLAY`,
            `DESCRIPTION:Time to take ${medicationName}`,
            `END:VALARM`,
            'END:VEVENT',
        ].join('\r\n')
    })

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//MedSchedule Pro//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        ...events,
        'END:VCALENDAR',
    ].join('\r\n')
}

/**
 * Format Date to ICS format.
 */
function formatIcsDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return (
        date.getFullYear().toString() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        'T' +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
    )
}

/**
 * Download an ICS file.
 */
export function downloadIcsFile(
    doses: Dose[],
    medicationName: string,
    patientName: string
): void {
    const content = generateIcsContent(doses, medicationName, patientName)
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${medicationName.replace(/\s+/g, '_')}_schedule.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * Open Google Calendar with first dose as a template.
 */
export function openGoogleCalendar(
    doses: Dose[],
    medicationName: string,
    patientName: string
): void {
    if (doses.length === 0) return
    const url = buildGoogleCalendarUrl(doses[0], medicationName, patientName)
    window.open(url, '_blank')
}

/**
 * Build Outlook calendar URL for a dose.
 */
export function buildOutlookUrl(
    dose: Dose,
    medicationName: string,
    patientName: string
): string {
    const startIso = dose.dateTime.toISOString()
    const endIso = new Date(dose.dateTime.getTime() + 15 * 60 * 1000).toISOString()
    const subject = encodeURIComponent(`💊 ${medicationName}`)
    const body = patientName
        ? encodeURIComponent(`Medication: ${medicationName}\nPatient: ${patientName}\nDose #${dose.number}`)
        : encodeURIComponent(`Medication: ${medicationName}\nDose #${dose.number}`)

    return `https://outlook.office.com/calendar/0/action/compose?subject=${subject}&startdt=${startIso}&enddt=${endIso}&body=${body}`
}

/**
 * Open Outlook with the first dose.
 */
export function openOutlookCalendar(
    doses: Dose[],
    medicationName: string,
    patientName: string
): void {
    if (doses.length === 0) return
    const url = buildOutlookUrl(doses[0], medicationName, patientName)
    window.open(url, '_blank')
}

/**
 * Export all events to PDF (uses jsPDF + autotable).
 */
export function exportToPdf(
    doses: Dose[],
    medicationName: string,
    patientName: string,
    columns: 1 | 2,
    use24h: boolean,
    language: string,
    translations: {
        headerTitle: string
        medication: string
        patient: string
        period: string
        doseNumber: string
        date: string
        time: string
        status: string
        taken: string
        pending: string
        footer: string
    }
): void {
    import('jspdf').then(({ jsPDF }) => {
        import('jspdf-autotable').then(({ default: autoTable }) => {
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            })

            const pageWidth = doc.internal.pageSize.getWidth()
            const margin = 15

            // ─── Header ────────────────────────────────────────────
            doc.setFillColor(37, 175, 244)
            doc.rect(0, 0, pageWidth, 40, 'F')

            doc.setTextColor(255, 255, 255)
            doc.setFontSize(20)
            doc.setFont('helvetica', 'bold')
            doc.text(translations.headerTitle, margin, 18)

            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text(`${translations.medication}: ${medicationName}`, margin, 26)
            if (patientName) {
                doc.text(`${translations.patient}: ${patientName}`, margin, 32)
            }

            if (doses.length > 0) {
                const startDateStr = formatDateForPdf(doses[0].dateTime, language)
                const endDateStr = formatDateForPdf(doses[doses.length - 1].dateTime, language)
                doc.text(`${translations.period}: ${startDateStr} — ${endDateStr}`, margin, patientName ? 38 : 32)
            }

            // ─── Table ─────────────────────────────────────────────
            const tableData = doses.map((dose) => [
                dose.number.toString().padStart(2, '0'),
                formatDateForPdf(dose.dateTime, language),
                formatTimeForPdf(dose.dateTime, use24h),
                dose.taken ? `☑ ${translations.taken}` : `☐ ${translations.pending}`,
            ])

            const headers = [
                [translations.doseNumber, translations.date, translations.time, translations.status],
            ]

            if (columns === 1) {
                autoTable(doc, {
                    head: headers,
                    body: tableData,
                    startY: 48,
                    margin: { left: margin, right: margin },
                    styles: {
                        fontSize: 9,
                        cellPadding: 4,
                        font: 'helvetica',
                    },
                    headStyles: {
                        fillColor: [37, 175, 244],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        fontSize: 9,
                    },
                    alternateRowStyles: {
                        fillColor: [245, 247, 248],
                    },
                })
            } else {
                // 2-column layout
                const mid = Math.ceil(tableData.length / 2)
                const leftData = tableData.slice(0, mid)
                const rightData = tableData.slice(mid)

                const colWidth = (pageWidth - margin * 3) / 2

                autoTable(doc, {
                    head: headers,
                    body: leftData,
                    startY: 48,
                    margin: { left: margin, right: pageWidth - margin - colWidth },
                    tableWidth: colWidth,
                    styles: {
                        fontSize: 8,
                        cellPadding: 3,
                        font: 'helvetica',
                    },
                    headStyles: {
                        fillColor: [37, 175, 244],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        fontSize: 8,
                    },
                    alternateRowStyles: {
                        fillColor: [245, 247, 248],
                    },
                })

                if (rightData.length > 0) {
                    autoTable(doc, {
                        head: headers,
                        body: rightData,
                        startY: 48,
                        margin: { left: margin * 2 + colWidth, right: margin },
                        tableWidth: colWidth,
                        styles: {
                            fontSize: 8,
                            cellPadding: 3,
                            font: 'helvetica',
                        },
                        headStyles: {
                            fillColor: [37, 175, 244],
                            textColor: [255, 255, 255],
                            fontStyle: 'bold',
                            fontSize: 8,
                        },
                        alternateRowStyles: {
                            fillColor: [245, 247, 248],
                        },
                    })
                }
            }

            // ─── Footer ────────────────────────────────────────────
            const pageCount = doc.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                const pageHeight = doc.internal.pageSize.getHeight()
                doc.setFontSize(9)
                doc.setTextColor(100, 116, 139)
                doc.setFont('helvetica', 'italic')
                doc.text(translations.footer, pageWidth / 2, pageHeight - 10, {
                    align: 'center',
                })
                doc.setFontSize(7)
                doc.text(
                    `MedSchedule Pro - Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    pageHeight - 5,
                    { align: 'center' }
                )
            }

            doc.save(`${medicationName.replace(/\s+/g, '_')}_schedule.pdf`)
        })
    })
}
