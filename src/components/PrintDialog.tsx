import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PrintDialogProps {
    open: boolean
    onClose: () => void
    onExport: (columns: 1 | 2) => void
}

export default function PrintDialog({ open, onClose, onExport }: PrintDialogProps) {
    const { t } = useTranslation()
    const [columns, setColumns] = useState<1 | 2>(1)

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up"
            onClick={onClose}
            data-testid="print-dialog-overlay"
        >
            <div
                className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 w-full max-w-sm mx-4 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
                data-testid="print-dialog"
            >
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
                    {t('pdf.dialogTitle')}
                </h3>

                <div className="space-y-3 mb-6">
                    <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">
                        {t('pdf.layoutLabel')}
                    </label>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setColumns(1)}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-bold transition-all duration-200 ${columns === 1
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:border-slate-300'
                                }`}
                            data-testid="pdf-1col"
                        >
                            <span className="material-icons-round text-lg mb-1 block">view_agenda</span>
                            {t('pdf.oneColumn')}
                        </button>
                        <button
                            onClick={() => setColumns(2)}
                            className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-bold transition-all duration-200 ${columns === 2
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-slate-200 dark:border-slate-600 text-slate-500 hover:border-slate-300'
                                }`}
                            data-testid="pdf-2col"
                        >
                            <span className="material-icons-round text-lg mb-1 block">view_column</span>
                            {t('pdf.twoColumns')}
                        </button>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        data-testid="pdf-cancel"
                    >
                        {t('pdf.cancel')}
                    </button>
                    <button
                        onClick={() => onExport(columns)}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all duration-200 flex items-center justify-center gap-2"
                        data-testid="pdf-export"
                    >
                        <span className="material-icons-round text-lg">picture_as_pdf</span>
                        {t('pdf.export')}
                    </button>
                </div>
            </div>
        </div>
    )
}
