import { useTranslation } from 'react-i18next'
import { useScheduleStore } from '../store/useScheduleStore'
import { getEstimatedEnd } from '../utils/doseCalculator'
import { formatEstimatedEnd } from '../utils/dateFormat'

export default function ConfigPanel() {
    const { t } = useTranslation()
    const {
        medicationName,
        setMedicationName,
        patientName,
        setPatientName,
        startDate,
        setStartDate,
        startTime,
        setStartTime,
        intervalHours,
        setIntervalHours,
        durationType,
        setDurationType,
        durationValue,
        setDurationValue,
        generateDoses,
        language,
    } = useScheduleStore()

    const estimatedEnd = getEstimatedEnd({
        startDate,
        startTime,
        intervalHours,
        durationType,
        durationValue,
    })

    const handleGenerate = () => {
        generateDoses()
    }

    return (
        <section className="lg:col-span-4 flex flex-col gap-6 no-print">
            <div className="bg-white/80 dark:bg-surface-dark/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-soft dark:shadow-dark-soft rounded-xl p-6 lg:p-8 flex flex-col gap-8 transition-colors duration-300">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                        {t('config.heading')}
                    </h2>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                        {t('config.description')}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Section 1: Patient & Drug */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                                1
                            </span>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                                {t('config.sectionPatient')}
                            </h3>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide mb-2">
                                {t('config.medicationName')}
                            </label>
                            <input
                                type="text"
                                value={medicationName}
                                onChange={(e) => setMedicationName(e.target.value)}
                                placeholder={t('config.medicationPlaceholder')}
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 px-4 py-3 text-sm font-medium text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-500"
                                data-testid="medication-name"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide mb-2">
                                {t('config.patientName')}{' '}
                                <span className="normal-case opacity-50 font-normal">{t('config.patientOptional')}</span>
                            </label>
                            <input
                                type="text"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder={t('config.patientPlaceholder')}
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 px-4 py-3 text-sm font-medium text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-500"
                                data-testid="patient-name"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 dark:bg-slate-700" />

                    {/* Section 2: Frequency */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                                2
                            </span>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                                {t('config.sectionFrequency')}
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide mb-2">
                                    {t('config.startDate')}
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 px-4 py-3 text-sm font-medium text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 dark:[color-scheme:dark]"
                                    data-testid="start-date"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide mb-2">
                                    {t('config.startTime')}
                                </label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 px-4 py-3 text-sm font-medium text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 dark:[color-scheme:dark]"
                                    data-testid="start-time"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide mb-2">
                                {t('config.repeatEvery')}
                            </label>
                            <div className="flex rounded-lg shadow-sm">
                                <div className="relative flex-grow focus-within:z-10">
                                    <input
                                        type="number"
                                        min={1}
                                        value={intervalHours}
                                        onChange={(e) => setIntervalHours(Number(e.target.value))}
                                        placeholder="e.g. 8"
                                        className="block w-full rounded-none rounded-l-lg border border-r-0 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 py-3 pl-4 pr-3 text-sm font-medium text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                                        data-testid="interval-hours"
                                    />
                                </div>
                                <div className="relative flex items-center justify-center bg-slate-50 dark:bg-slate-800/80 border border-l-0 border-slate-200 dark:border-slate-600 rounded-r-lg px-4 py-3 min-w-[4rem]">
                                    <span className="text-xs font-bold uppercase tracking-wide text-text-secondary-light dark:text-slate-400">
                                        {t('config.hoursUnit')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 dark:bg-slate-700" />

                    {/* Section 3: Duration */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                                3
                            </span>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                                {t('config.sectionDuration')}
                            </h3>
                        </div>

                        <div className="bg-primary/5 dark:bg-blue-500/10 rounded-lg p-4 border border-primary/10 dark:border-blue-500/20">
                            <div className="flex gap-4 mb-4">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="duration-type"
                                        checked={durationType === 'days'}
                                        onChange={() => setDurationType('days')}
                                        className="text-primary focus:ring-primary bg-transparent border-slate-300 dark:border-slate-500"
                                        data-testid="duration-days"
                                    />
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                        {t('config.byDays')}
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="duration-type"
                                        checked={durationType === 'quantity'}
                                        onChange={() => setDurationType('quantity')}
                                        className="text-primary focus:ring-primary bg-transparent border-slate-300 dark:border-slate-500"
                                        data-testid="duration-quantity"
                                    />
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                        {t('config.byQuantity')}
                                    </span>
                                </label>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    min={1}
                                    value={durationValue}
                                    onChange={(e) => setDurationValue(Number(e.target.value))}
                                    className="w-24 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 px-4 py-3 text-center text-lg font-bold text-primary dark:text-blue-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
                                    data-testid="duration-value"
                                />
                                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                                    {durationType === 'days' ? t('config.daysTotal') : t('config.dosesTotal')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <div className="mt-auto pt-4">
                    <button
                        onClick={handleGenerate}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 group relative overflow-hidden"
                        data-testid="generate-btn"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        <span className="material-icons-round">auto_awesome</span>
                        {t('config.generateSchedule')}
                    </button>

                    {estimatedEnd && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-secondary-light dark:text-text-secondary-dark animate-fade-in-up">
                            <span className="material-icons-round text-sm">info</span>
                            <span>
                                {t('config.estimatedEnd')}:{' '}
                                <strong className="text-primary dark:text-blue-400">
                                    {formatEstimatedEnd(estimatedEnd, language)}
                                </strong>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
