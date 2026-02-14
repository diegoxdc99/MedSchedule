import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { type Dose } from '../utils/doseCalculator'

interface PrintTemplateProps {
    patientName: string
    medicationName: string
    prescriptionDetails: string
    doses: Dose[]
    layout: '1-col' | '2-col'
}

const ITEMS_PER_COL = 13

export const PrintTemplate = forwardRef<HTMLDivElement, PrintTemplateProps>(
    ({ patientName, medicationName, prescriptionDetails, doses, layout }, ref) => {
        const { t, i18n } = useTranslation()
        const isEs = i18n.language.startsWith('es')
        const dateLocale = isEs ? es : enUS

        // Pagination Logic
        const itemsPerPage = layout === '2-col' ? ITEMS_PER_COL * 2 : ITEMS_PER_COL
        const totalPages = Math.ceil(doses.length / itemsPerPage) || 1

        const pages = Array.from({ length: totalPages }, (_, i) => {
            const start = i * itemsPerPage
            return doses.slice(start, start + itemsPerPage)
        })

        const formatDate = (date: Date) => format(date, 'MMM d', { locale: dateLocale })
        const formatTime = (date: Date) => format(date, 'hh:mm a', { locale: dateLocale })

        // Helper to render a column of doses
        const renderColumn = (colDoses: Dose[]) => (
            <div className="flex flex-col gap-2 w-full">
                {/* Column Header */}
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 bg-[rgba(224,242,254,0.5)] rounded-lg mb-2 items-center border border-[#e0f2fe]">
                    <span className="text-xs font-bold text-[#64748b] uppercase text-[#0369a1]">{t('print.done')}</span>
                    <span className="text-xs font-bold text-[#64748b] uppercase text-[#0369a1]">{t('print.date')}</span>
                    <span className="text-xs font-bold text-[#64748b] uppercase text-[#0369a1]">{t('print.time')}</span>
                    <span className="text-xs font-bold text-[#64748b] uppercase text-center w-6">#</span>
                </div>

                {/* Rows */}
                {colDoses.map((dose) => (
                    <div key={dose.id} className="flex items-center p-3 rounded-lg border border-[#f1f5f9] bg-[#ffffff] shadow-[0_1px_2px_rgba(0,0,0,0.05)] break-inside-avoid">
                        <div className="w-8 flex justify-center">
                            <div className="w-6 h-6 rounded-full border-2 border-[#e2e8f0]"></div>
                        </div>
                        <div className="flex-1 font-semibold text-[#334155] pl-4">{formatDate(dose.dateTime)}</div>
                        <div className="flex-1 font-bold text-[#38bdf8]">{formatTime(dose.dateTime)}</div>
                        <div className="w-8 font-friendly font-bold text-[#cbd5e1] text-lg text-right">
                            {(dose.number).toString().padStart(2, '0')}
                        </div>
                    </div>
                ))}
            </div>
        )

        return (
            <div ref={ref} className="bg-slate-500/20">
                {pages.map((pageDoses, pageIndex) => {
                    // Inside page split for columns
                    const columns: Dose[][] = []
                    if (layout === '2-col') {
                        const left = pageDoses.slice(0, ITEMS_PER_COL)
                        const right = pageDoses.slice(ITEMS_PER_COL)
                        columns.push(left)
                        if (right.length > 0) columns.push(right)
                    } else {
                        columns.push(pageDoses)
                    }

                    return (
                        <div key={pageIndex} className="print-sheet bg-[#ffffff] w-[210mm] h-[297mm] p-[10mm] mx-auto relative overflow-hidden text-[#1e293b] mb-4 shadow-lg shrink-0">
                            {/* Background Decorations */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0f9ff] rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none opacity-60"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f0f9ff] rounded-tr-full -ml-12 -mb-12 z-0 pointer-events-none opacity-60"></div>

                            {/* Header */}
                            <header className="relative z-10 flex justify-between items-start mb-8 border-b-2 border-dashed border-[#f1f5f9] pb-6">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-[#38bdf8] flex items-center justify-center text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                            <span className="material-icons-round text-2xl">medication_liquid</span>
                                        </div>
                                        <div>
                                            <h1 className="font-friendly text-3xl text-[#38bdf8] tracking-tight">{t('print.title')}</h1>
                                            <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-widest ml-0.5">{t('print.subtitle')}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-[#94a3b8] text-sm font-medium uppercase tracking-wide mb-1">{t('print.patient')}</p>
                                        <h2 className="text-3xl font-bold text-[#1e293b]">{patientName || '______________'}</h2>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="bg-[#f0f9ff] px-4 py-2 rounded-full mb-6 inline-block">
                                        <span className="font-friendly text-[#38bdf8] text-lg font-medium flex items-center gap-2">
                                            <span className="material-icons-round text-base">favorite</span>
                                            {t('print.stayHealthy')}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[#94a3b8] text-sm font-medium uppercase tracking-wide mb-1">{t('print.prescription')}</p>
                                        <h2 className="text-2xl font-bold text-[#25aff4]">{medicationName}</h2>
                                        <div className="flex items-center justify-end gap-2 mt-1 text-[#64748b] font-medium text-sm">
                                            <span className="material-icons-round text-sm">schedule</span>
                                            <span>{prescriptionDetails}</span>
                                        </div>
                                    </div>
                                </div>
                            </header>

                            {/* Main Content (Doses) */}
                            <main className="relative z-10">
                                <div className={`grid ${columns.length > 1 ? 'grid-cols-2 gap-x-8' : 'grid-cols-1'} items-start`}>
                                    {columns.map((col, idx) => (
                                        <div key={idx} className="flex flex-col gap-2">
                                            {renderColumn(col)}
                                        </div>
                                    ))}
                                </div>
                            </main>

                            {/* Footer */}
                            <footer className="absolute bottom-0 left-0 w-full px-12 py-6 flex items-center justify-between border-t border-[#f1f5f9] bg-[#ffffff]">
                                <div className="text-xs text-[#94a3b8] font-medium flex items-center gap-1">
                                    <span className="material-icons-round text-sm">print</span>
                                    {t('print.printedOn')} <span className="text-[#475569] font-bold">{format(new Date(), 'PP', { locale: dateLocale })}</span>
                                </div>
                                <div className="text-center">
                                    <p className="font-friendly text-[#cbd5e1] text-sm italic">{t('print.footerQuote')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#cbd5e1] uppercase tracking-widest">{t('print.page')} {pageIndex + 1} / {totalPages}</span>
                                </div>
                            </footer>
                        </div>
                    )
                })}
            </div>
        )
    }
)
