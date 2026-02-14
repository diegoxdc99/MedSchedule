export interface Dose {
    id: string
    number: number
    dateTime: Date
    taken: boolean
}

export type DurationType = 'days' | 'quantity'

export interface ScheduleInput {
    startDate: string
    startTime: string
    intervalHours: number
    durationType: DurationType
    durationValue: number
}

/**
 * Generate doses by number of days.
 * The last valid dose must START within the last calendar day (day N),
 * so doses that would spill past 23:59 of day (startDate + days - 1) are excluded.
 */
export function generateByDays(
    startDate: string,
    startTime: string,
    intervalHours: number,
    days: number
): Dose[] {
    if (days <= 0 || intervalHours <= 0) return []

    const [year, month, day] = startDate.split('-').map(Number)
    const [hours, minutes] = startTime.split(':').map(Number)
    const start = new Date(year, month - 1, day, hours, minutes, 0, 0)

    // The duration covers exactly X * 24 hours from the start time
    const endTime = new Date(start.getTime() + days * 24 * 60 * 60 * 1000)

    const doses: Dose[] = []
    let current = new Date(start)
    let count = 1

    while (current.getTime() < endTime.getTime()) {
        doses.push({
            id: `dose-${count}`,
            number: count,
            dateTime: new Date(current),
            taken: false,
        })
        count++
        current = new Date(current.getTime() + intervalHours * 60 * 60 * 1000)
    }

    return doses
}

/**
 * Generate a fixed number of doses.
 */
export function generateByQuantity(
    startDate: string,
    startTime: string,
    intervalHours: number,
    quantity: number
): Dose[] {
    if (quantity <= 0 || intervalHours <= 0) return []

    const [year, month, day] = startDate.split('-').map(Number)
    const [hours, minutes] = startTime.split(':').map(Number)
    const start = new Date(year, month - 1, day, hours, minutes, 0, 0)

    const doses: Dose[] = []

    for (let i = 0; i < quantity; i++) {
        const doseTime = new Date(start.getTime() + i * intervalHours * 60 * 60 * 1000)
        doses.push({
            id: `dose-${i + 1}`,
            number: i + 1,
            dateTime: new Date(doseTime),
            taken: false,
        })
    }

    return doses
}

/**
 * Main schedule generator dispatcher.
 */
export function generateSchedule(input: ScheduleInput): Dose[] {
    if (input.durationType === 'days') {
        return generateByDays(input.startDate, input.startTime, input.intervalHours, input.durationValue)
    }
    return generateByQuantity(input.startDate, input.startTime, input.intervalHours, input.durationValue)
}

/**
 * Get the estimated end date of a schedule configuration.
 */
export function getEstimatedEnd(input: ScheduleInput): Date | null {
    const doses = generateSchedule(input)
    if (doses.length === 0) return null
    return doses[doses.length - 1].dateTime
}
