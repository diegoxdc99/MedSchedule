import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useScheduleStore } from '../store/useScheduleStore'
import DoseRow from './DoseRow'
import PrintDialog from './PrintDialog'
import { PrintTemplate } from './PrintTemplate'
import { downloadIcsFile } from '../utils/calendarExport'

export default function ScheduleTable() {
    const { t } = useTranslation()
    const {
        doses,
        medicationName,
        patientName,
        removeLastDose,
        addManualDose,
        intervalHours,
    } = useScheduleStore()

    const [showPrintDialog, setShowPrintDialog] = useState(false)
    const [printLayout, setPrintLayout] = useState<'1-col' | '2-col'>('1-col')
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
    const printRef = useRef<HTMLDivElement>(null)

    const handlePdfExport = async (columns: 1 | 2) => {
        setPrintLayout(columns === 1 ? '1-col' : '2-col')
        setShowPrintDialog(false)
        setIsGeneratingPdf(true)

        // Allow time for state update and render
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (printRef.current) {
            try {
                // Find all page sheets
                const pages = printRef.current.querySelectorAll('.print-sheet') as NodeListOf<HTMLElement>

                if (pages.length === 0) {
                    throw new Error('No pages found to print')
                }

                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                })

                for (let i = 0; i < pages.length; i++) {
                    const page = pages[i]

                    // Capture each page
                    const canvas = await html2canvas(page, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff'
                    })

                    const imgData = canvas.toDataURL('image/png')
                    const pdfWidth = pdf.internal.pageSize.getWidth()
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

                    // Add page to PDF
                    if (i > 0) pdf.addPage()
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
                }

                pdf.save(`${medicationName.replace(/\s+/g, '_') || 'schedule'}.pdf`)
            } catch (error) {
                console.error('Failed to generate PDF', error)
                const message = error instanceof Error ? error.message : String(error)
                alert(`Error generating PDF: ${message}`)
            } finally {
                setIsGeneratingPdf(false)
            }
        }
    }

    const getPrescriptionDetails = () => {
        if (intervalHours > 0) {
            return `${t('config.repeatEvery')} ${intervalHours} ${t('config.hoursUnit')}`
        }
        return ''
    }

    return (
        <section className="lg:col-span-8 flex flex-col h-full print-full-width relative">
            {/* Hidden Print Template */}
            <div className="fixed left-[-9999px] top-[-9999px] overflow-hidden">
                <div className="w-[210mm] min-h-[297mm]">
                    <PrintTemplate
                        ref={printRef}
                        patientName={patientName}
                        medicationName={medicationName}
                        prescriptionDetails={getPrescriptionDetails()}
                        doses={doses}
                        layout={printLayout}
                    />
                </div>
            </div>

            {/* Header Bar */}
            <div className="relative z-10 bg-white/80 dark:bg-surface-dark/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-soft dark:shadow-dark-soft rounded-t-xl border-b-0 p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-colors duration-300">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                        <span className="material-icons-round text-2xl">calendar_today</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
                            {t('schedule.heading')}
                        </h2>
                        {(medicationName || patientName) && (
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                {medicationName && (
                                    <span className="font-semibold text-primary dark:text-blue-400 break-words">
                                        {medicationName}
                                    </span>
                                )}
                                {medicationName && patientName && (
                                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0 hidden sm:block" />
                                )}
                                {patientName && (
                                    <span className="flex flex-wrap items-center gap-1">
                                        <span className="shrink-0">{t('schedule.forPatient')}</span>
                                        <span className="font-medium break-words">{patientName}</span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 no-print flex-wrap">
                    {/* Remove Last */}
                    <button
                        onClick={removeLastDose}
                        disabled={doses.length === 0 || isGeneratingPdf}
                        className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600 text-text-primary-light dark:text-text-primary-dark font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        data-testid="remove-last"
                    >
                        <span className="material-icons-round text-lg text-slate-400 dark:text-slate-500">
                            remove_circle_outline
                        </span>
                        <span className="hidden sm:inline">{t('schedule.removeLast')}</span>
                    </button>

                    {/* Calendar Download */}
                    <button
                        onClick={() => downloadIcsFile(doses, medicationName, patientName)}
                        className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                        disabled={doses.length === 0 || isGeneratingPdf}
                        data-testid="calendar-export-btn"
                    >
                        <span className="material-icons-round text-lg">event</span>
                        <span>{t('schedule.downloadIcs')}</span>
                    </button>

                    {/* Print / PDF */}
                    <button
                        onClick={() => setShowPrintDialog(true)}
                        disabled={doses.length === 0 || isGeneratingPdf}
                        className="bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 dark:border dark:border-slate-600 font-bold py-2 px-5 rounded-lg shadow-lg flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        data-testid="print-pdf-btn"
                    >
                        {isGeneratingPdf ? (
                            <span className="material-icons-round animate-spin">refresh</span>
                        ) : (
                            <span className="material-icons-round">print</span>
                        )}
                        <span>{isGeneratingPdf ? 'Generating...' : t('schedule.printPdf')}</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/80 dark:bg-surface-dark/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-soft dark:shadow-dark-soft rounded-b-xl border-t-0 flex-grow flex flex-col overflow-hidden min-h-[500px] transition-colors duration-300">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-700/50 text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                    <div className="col-span-2 sm:col-span-1">{t('schedule.columnNumber')}</div>
                    <div className="col-span-4 sm:col-span-3">{t('schedule.columnDate')}</div>
                    <div className="col-span-4 sm:col-span-3">{t('schedule.columnTime')}</div>
                    <div className="col-span-2 sm:col-span-4 text-right sm:text-left">{t('schedule.columnStatus')}</div>
                    <div className="hidden sm:flex col-span-1 justify-end">{t('schedule.columnActions')}</div>
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto flex-grow" data-testid="dose-list">
                    {doses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600 py-20">
                            <span className="material-icons-round text-6xl mb-4 animate-pulse-soft">medication</span>
                            <p className="text-sm font-medium">{t('config.description')}</p>
                        </div>
                    ) : (
                        <>
                            {doses.map((dose, index) => (
                                <DoseRow key={dose.id} dose={dose} index={index} />
                            ))}

                            {/* Add Dose Button */}
                            <div className="px-6 py-4 no-print">
                                <button
                                    onClick={addManualDose}
                                    className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-400 dark:text-slate-500 font-bold text-sm hover:border-primary hover:text-primary dark:hover:text-blue-400 dark:hover:border-blue-400 transition-all duration-300 flex items-center justify-center gap-2"
                                    data-testid="add-dose"
                                >
                                    <span className="material-icons-round">add</span>
                                    {t('schedule.addDose')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Print Dialog */}
            <PrintDialog
                open={showPrintDialog}
                onClose={() => setShowPrintDialog(false)}
                onExport={handlePdfExport}
            />
        </section>
    )
}
