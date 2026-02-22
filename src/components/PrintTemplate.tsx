import { forwardRef, useRef, useState, useLayoutEffect } from 'react'
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
    rowsPerPage?: number
}

// Row height = py-[8px]*2 + text-sm line-height (20px) = 36px
// Gap between rows = gap-1 = 4px
const ROW_H = 36
const ROW_GAP = 4

// Inline SVG — avoids html2canvas failing to load relative-URL <img> from off-screen elements
const AppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40" height="40"
        style={{ borderRadius: 12, flexShrink: 0, display: 'block' }}>
        <defs>
            <linearGradient id="pt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <clipPath id="pt-pill">
                <rect x="-70" y="-120" width="140" height="240" rx="70" ry="70" />
            </clipPath>
        </defs>
        <circle cx="256" cy="256" r="240" fill="url(#pt-grad)" />
        <g transform="translate(256,256) rotate(-45)">
            <rect x="-70" y="-120" width="140" height="240" rx="70" ry="70" fill="#ffffff" />
            <rect x="-70" y="0" width="140" height="120" fill="#38bdf8" clipPath="url(#pt-pill)" />
            <path d="M -40 -90 Q -20 -110 40 -90" stroke="white" strokeWidth="8"
                strokeLinecap="round" opacity="0.4" fill="none" />
        </g>
        <line x1="256" y1="256" x2="256" y2="160" stroke="#0c4a6e" strokeWidth="24" strokeLinecap="round" />
        <line x1="256" y1="256" x2="310" y2="256" stroke="#0c4a6e" strokeWidth="24" strokeLinecap="round" />
        <circle cx="256" cy="256" r="18" fill="#0c4a6e" />
    </svg>
)

export const PrintTemplate = forwardRef<HTMLDivElement, PrintTemplateProps>(
    ({ patientName, medicationName, prescriptionDetails, doses, layout, rowsPerPage }, ref) => {
        const { t, i18n } = useTranslation()
        const isEs = i18n.language.startsWith('es')
        const dateLocale = isEs ? es : enUS

        const [computedRows, setComputedRows] = useState<number | null>(rowsPerPage ?? null)

        const probeMainRef = useRef<HTMLDivElement>(null)
        const probeColHeaderRef = useRef<HTMLDivElement>(null)

        useLayoutEffect(() => {
            if (rowsPerPage !== undefined) return
            const main = probeMainRef.current
            const colHeader = probeColHeaderRef.current
            if (!main || !colHeader) return

            // clientHeight of the flex-1 main = exact available space (flex already resolved
            // header height + margins + footer height + margins within the page).
            // Formula: colHeader + N*(ROW_H + ROW_GAP) <= mainH  =>  N = floor((mainH - colH) / 40)
            const mainH = main.clientHeight
            const colH = colHeader.offsetHeight
            const rows = Math.floor((mainH - colH) / (ROW_H + ROW_GAP)) - 1
            setComputedRows(Math.max(1, rows))
        }, [rowsPerPage])

        const formatDate = (date: Date) => format(date, 'MMM d', { locale: dateLocale })
        const formatTime = (date: Date) => format(date, 'hh:mm a', { locale: dateLocale })

        // Shared column header — mirrors exact column widths used in rows
        const renderColHeader = (innerRef?: React.Ref<HTMLDivElement>) => (
            <div ref={innerRef} className="flex gap-2 px-2 py-1.5 rounded-lg border border-[#e0f2fe] bg-[rgba(224,242,254,0.5)]">
                <div className="w-8 shrink-0 flex justify-center">
                    <span className="text-[10px] font-bold uppercase text-[#0369a1]">{t('print.done')}</span>
                </div>
                <div className="flex-1 text-[10px] font-bold uppercase text-[#0369a1]">{t('print.date')}</div>
                <div className="flex-1 text-[10px] font-bold uppercase text-[#0369a1]">{t('print.time')}</div>
                <div className="w-10 shrink-0 text-[10px] font-bold uppercase text-[#0369a1] text-right">{t('print.columnNumber')}</div>
            </div>
        )

        const renderHeader = (innerRef?: React.Ref<HTMLDivElement>) => (
            <div ref={innerRef} className="flex justify-between items-start border-b-2 border-[#e2e8f0] pb-4 mb-4 shrink-0 relative z-10">
                {/* Left: logo + patient */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 mb-2">
                        <AppIcon />
                        <div>
                            <h1 className="font-friendly text-3xl text-[#38bdf8] tracking-tight leading-tight">
                                {t('print.title')}
                            </h1>
                            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">
                                {t('print.subtitle')}
                            </p>
                        </div>
                    </div>
                    <div className="mt-1">
                        <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide mb-0.5">
                            {t('print.patient')}
                        </p>
                        <h2 className="text-3xl font-bold text-[#1e293b] leading-tight">
                            {patientName || '______________'}
                        </h2>
                    </div>
                </div>
                {/* Right: badge + prescription */}
                <div className="flex flex-col items-end">
                    <div className="bg-[#f0f9ff] px-4 py-1.5 rounded-full mb-4 flex items-center gap-2">
                        <span className="material-icons-round text-[#38bdf8] text-sm">favorite</span>
                        <span className="font-friendly text-[#38bdf8] text-base font-medium">
                            {t('print.stayHealthy')}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide mb-0.5">
                            {t('print.prescription')}
                        </p>
                        <h2 className="text-2xl font-bold text-[#25aff4] leading-tight">{medicationName}</h2>
                        <div className="flex items-center justify-end gap-1.5 mt-1 text-[#64748b] text-xs font-medium">
                            <span className="material-icons-round text-xs">schedule</span>
                            <span>{prescriptionDetails}</span>
                        </div>
                    </div>
                </div>
            </div>
        )

        const renderFooter = (pageIndex: number, totalPages: number) => (
            <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-3 mt-3 shrink-0 relative z-10">
                <div className="flex items-center gap-1 text-[11px] text-[#94a3b8] font-medium">
                    <span className="material-icons-round text-xs">print</span>
                    {t('print.printedOn')}
                    <span className="text-[#475569] font-bold ml-1">
                        {format(new Date(), 'PP', { locale: dateLocale })}
                    </span>
                </div>
                <p className="font-friendly text-[#cbd5e1] text-xs italic">{t('print.footerQuote')}</p>
                <span className="text-[11px] font-bold text-[#cbd5e1] uppercase tracking-widest">
                    {t('print.page')} {pageIndex + 1} / {totalPages}
                </span>
            </div>
        )

        const PAGE_CLS = "print-sheet bg-white w-[210mm] h-[297mm] p-[10mm] mx-auto relative overflow-hidden text-[#1e293b] flex flex-col"

        // ── Probe render: off-screen, invisible, used only to measure available main height ──
        if (computedRows === null) {
            return (
                <div ref={ref} style={{ position: 'fixed', top: -9999, left: -9999, visibility: 'hidden', pointerEvents: 'none' }}>
                    <div className={PAGE_CLS}>
                        {renderHeader()}
                        {/* flex-1 main — its clientHeight is exactly the space left for rows */}
                        <div ref={probeMainRef} className="flex-1 min-h-0">
                            {renderColHeader(probeColHeaderRef)}
                        </div>
                        {renderFooter(0, 1)}
                    </div>
                </div>
            )
        }

        // ── Real paginated render ──
        const itemsPerPage = layout === '2-col' ? computedRows * 2 : computedRows
        const totalPages = Math.ceil(doses.length / itemsPerPage) || 1
        const pages = Array.from({ length: totalPages }, (_, i) =>
            doses.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
        )

        const renderColumn = (colDoses: Dose[]) => (
            <div className="flex flex-col gap-1 w-full">
                {renderColHeader()}
                {colDoses.map((dose) => (
                    // py-[8px] + text-sm (20px line-height) = 36px total row height
                    // Padding centers the text without needing CSS centering tricks
                    <div key={dose.id}
                        className="flex gap-2 px-2 py-[8px] rounded-lg border border-[#e2e8f0] bg-white">
                        {/* Checkbox — items-center centers the 20px circle in the 36px-tall stretched cell */}
                        <div className="w-8 shrink-0 flex justify-center items-center">
                            <div className="w-5 h-5 rounded-full border-2 border-[#bae6fd]" />
                        </div>
                        {/* Text cells — stretch to full content height (20px), text naturally fills */}
                        <div className="flex-1 text-sm font-semibold text-[#334155]">
                            {formatDate(dose.dateTime)}
                        </div>
                        <div className="flex-1 text-sm font-bold text-[#38bdf8]">
                            {formatTime(dose.dateTime)}
                        </div>
                        <div className="w-10 shrink-0 text-sm font-bold text-[#cbd5e1] text-right tabular-nums">
                            {dose.number.toString().padStart(2, '0')}
                        </div>
                    </div>
                ))}
            </div>
        )

        return (
            <div ref={ref} className="bg-slate-500/20">
                {pages.map((pageDoses, pageIndex) => {
                    const columns: Dose[][] = []
                    if (layout === '2-col') {
                        const left = pageDoses.slice(0, computedRows)
                        const right = pageDoses.slice(computedRows)
                        columns.push(left)
                        if (right.length > 0) columns.push(right)
                    } else {
                        columns.push(pageDoses)
                    }

                    return (
                        <div key={pageIndex} className={`${PAGE_CLS} mb-4 shadow-lg shrink-0`}>
                            {/* Background decorations */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0f9ff] rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none opacity-60" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#f0f9ff] rounded-tr-full -ml-12 -mb-12 z-0 pointer-events-none opacity-60" />

                            {renderHeader()}

                            {/* Main — flex-1 fills the exact space between header and footer */}
                            <main className="flex-1 min-h-0 overflow-hidden relative z-10">
                                <div className={`grid h-full items-start ${columns.length > 1 ? 'grid-cols-2 gap-x-6' : 'grid-cols-1'}`}>
                                    {columns.map((col, idx) => (
                                        <div key={idx}>{renderColumn(col)}</div>
                                    ))}
                                </div>
                            </main>

                            {renderFooter(pageIndex, totalPages)}
                        </div>
                    )
                })}
            </div>
        )
    }
)
