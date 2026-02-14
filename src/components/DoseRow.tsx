import { useTranslation } from 'react-i18next'
import { type Dose } from '../utils/doseCalculator'
import { formatDate, formatTime } from '../utils/dateFormat'
import { useScheduleStore } from '../store/useScheduleStore'

interface DoseRowProps {
    dose: Dose
    index: number
}



export default function DoseRow({ dose, index }: DoseRowProps) {
    const { t } = useTranslation()
    const { use24h, language, toggleDoseTaken } = useScheduleStore()

    const hour = dose.dateTime.getHours()
    let timeColorClass = ''
    let timeIcon = ''

    if (hour >= 5 && hour < 12) {
        // Morning: Blue
        timeColorClass = 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
        timeIcon = 'wb_sunny'
    } else if (hour >= 12 && hour < 18) {
        // Afternoon: Amber
        timeColorClass = 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
        timeIcon = 'wb_twilight'
    } else {
        // Night: Indigo
        timeColorClass = 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
        timeIcon = 'bedtime'
    }

    return (
        <div
            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-slate-50 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group animate-fade-in-up ${dose.taken ? 'opacity-60' : ''
                }`}
            style={{ animationDelay: `${index * 50}ms` }}
            data-testid={`dose-row-${dose.number}`}
        >
            {/* Number */}
            <div className="col-span-2 sm:col-span-1 font-mono text-sm text-slate-400 dark:text-slate-500">
                {dose.number.toString().padStart(2, '0')}
            </div>

            {/* Date */}
            <div className={`col-span-4 sm:col-span-3 font-semibold text-sm ${dose.taken ? 'text-slate-400 dark:text-slate-500' : ''}`}>
                {formatDate(dose.dateTime, language)}
            </div>

            {/* Time */}
            <div className="col-span-4 sm:col-span-3">
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-sm font-bold ${timeColorClass} ${dose.taken ? 'opacity-60' : ''}`}>
                    <span className="material-icons-round text-base">{timeIcon}</span>
                    <span>{formatTime(dose.dateTime, use24h)}</span>
                </div>
            </div>

            {/* Status */}
            <div className="col-span-2 sm:col-span-4 flex justify-end sm:justify-start">
                <label className="flex items-center gap-3 cursor-pointer group/check">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={dose.taken}
                            onChange={() => toggleDoseTaken(dose.id)}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white checked:border-primary checked:bg-primary transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:checked:border-primary dark:checked:bg-primary"
                            data-testid={`dose-checkbox-${dose.number}`}
                        />
                        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200">
                            <span className="material-icons-round text-base">check</span>
                        </span>
                    </div>
                    <span
                        className={`hidden sm:inline text-sm transition-colors ${dose.taken
                            ? 'text-slate-400 dark:text-slate-500 line-through decoration-slate-400 dark:decoration-slate-500'
                            : 'text-text-secondary-light dark:text-text-secondary-dark font-medium group-hover/check:text-primary dark:group-hover/check:text-blue-400'
                            }`}
                    >
                        {dose.taken ? t('schedule.taken') : t('schedule.pending')}
                    </span>
                </label>
            </div>

            {/* Actions (hidden on print) */}
            <div className="hidden sm:flex col-span-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity no-print">
                <button
                    className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                    aria-label="Delete dose"
                >
                    <span className="material-icons-round text-lg">delete</span>
                </button>
            </div>
        </div>
    )
}
