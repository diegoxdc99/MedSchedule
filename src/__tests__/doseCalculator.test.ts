import { describe, it, expect } from 'vitest'
import {
    generateByDays,
    generateByQuantity,
    generateSchedule,
    getEstimatedEnd,
} from '../utils/doseCalculator'

describe('doseCalculator', () => {
    describe('generateByDays', () => {
        it('should generate doses every 8 hours for 1 day (24h window)', () => {
            const doses = generateByDays('2024-01-15', '08:00', 8, 1)
            expect(doses).toHaveLength(3) // 08:00, 16:00, and 00:00 next day (within 24h)
            expect(doses[0].dateTime.getHours()).toBe(8)
            expect(doses[1].dateTime.getHours()).toBe(16)
            expect(doses[2].dateTime.getHours()).toBe(0)
        })

        it('should generate doses every 8 hours for 2 days', () => {
            const doses = generateByDays('2024-01-15', '08:00', 8, 2)
            // Day 1: 08:00, 16:00, 00:00 (next day but that counts as day 2)
            // Day 2: 00:00, 08:00, 16:00
            expect(doses.length).toBeGreaterThanOrEqual(4)
            expect(doses[0].number).toBe(1)
            expect(doses[0].taken).toBe(false)
            expect(doses[0].id).toBe('dose-1')
        })

        it('should generate doses within 24h window even if crossing midnight', () => {
            const doses = generateByDays('2024-01-15', '20:00', 8, 1)
            // Start at 20:00 Jan 15. End window is 20:00 Jan 16.
            // Doses: 20:00, 04:00, 12:00. Next is 20:00 (excluded).
            expect(doses).toHaveLength(3)
            expect(doses[0].dateTime.getHours()).toBe(20)
            expect(doses[1].dateTime.getHours()).toBe(4)
            expect(doses[2].dateTime.getHours()).toBe(12)
        })

        it('should return empty array for 0 days', () => {
            const doses = generateByDays('2024-01-15', '08:00', 8, 0)
            expect(doses).toHaveLength(0)
        })

        it('should return empty array for negative days', () => {
            const doses = generateByDays('2024-01-15', '08:00', 8, -1)
            expect(doses).toHaveLength(0)
        })

        it('should return empty array for 0 interval', () => {
            const doses = generateByDays('2024-01-15', '08:00', 0, 5)
            expect(doses).toHaveLength(0)
        })

        it('should return empty array for negative interval', () => {
            const doses = generateByDays('2024-01-15', '08:00', -4, 5)
            expect(doses).toHaveLength(0)
        })

        it('should handle 24-hour interval correctly', () => {
            const doses = generateByDays('2024-01-15', '10:00', 24, 3)
            expect(doses).toHaveLength(3)
            expect(doses[0].dateTime.getDate()).toBe(15)
            expect(doses[1].dateTime.getDate()).toBe(16)
            expect(doses[2].dateTime.getDate()).toBe(17)
        })

        it('should handle midnight crossing correctly', () => {
            const doses = generateByDays('2024-01-15', '22:00', 4, 2)
            // Day 1 (Jan 15): 22:00
            // Day 2 (Jan 16): 02:00, 06:00, 10:00, 14:00, 18:00, 22:00
            expect(doses.length).toBeGreaterThanOrEqual(2)
            expect(doses[0].dateTime.getHours()).toBe(22)
        })

        it('should generate single dose when interval exceeds day length', () => {
            const doses = generateByDays('2024-01-15', '12:00', 48, 1)
            expect(doses).toHaveLength(1)
        })

        it('should assign sequential numbers', () => {
            const doses = generateByDays('2024-01-15', '08:00', 6, 2)
            doses.forEach((dose, index) => {
                expect(dose.number).toBe(index + 1)
                expect(dose.id).toBe(`dose-${index + 1}`)
            })
        })
    })

    describe('generateByQuantity', () => {
        it('should generate exact number of doses', () => {
            const doses = generateByQuantity('2024-01-15', '08:00', 8, 5)
            expect(doses).toHaveLength(5)
        })

        it('should space doses correctly', () => {
            const doses = generateByQuantity('2024-01-15', '08:00', 8, 3)
            expect(doses[0].dateTime.getHours()).toBe(8)
            expect(doses[1].dateTime.getHours()).toBe(16)
            expect(doses[2].dateTime.getHours()).toBe(0) // midnight next day
        })

        it('should return empty array for 0 quantity', () => {
            const doses = generateByQuantity('2024-01-15', '08:00', 8, 0)
            expect(doses).toHaveLength(0)
        })

        it('should return empty array for negative quantity', () => {
            const doses = generateByQuantity('2024-01-15', '08:00', 8, -3)
            expect(doses).toHaveLength(0)
        })

        it('should return empty array for 0 interval', () => {
            const doses = generateByQuantity('2024-01-15', '08:00', 0, 5)
            expect(doses).toHaveLength(0)
        })

        it('should return empty array for negative interval', () => {
            const doses = generateByQuantity('2024-01-15', '08:00', -4, 5)
            expect(doses).toHaveLength(0)
        })

        it('should generate single dose', () => {
            const doses = generateByQuantity('2024-01-15', '10:00', 12, 1)
            expect(doses).toHaveLength(1)
            expect(doses[0].dateTime.getHours()).toBe(10)
            expect(doses[0].dateTime.getMinutes()).toBe(0)
        })

        it('should assign sequential IDs and numbers', () => {
            const doses = generateByQuantity('2024-01-15', '08:00', 6, 4)
            doses.forEach((dose, index) => {
                expect(dose.number).toBe(index + 1)
                expect(dose.id).toBe(`dose-${index + 1}`)
                expect(dose.taken).toBe(false)
            })
        })

        it('should handle large quantity', () => {
            const doses = generateByQuantity('2024-01-15', '08:00', 1, 100)
            expect(doses).toHaveLength(100)
        })
    })

    describe('generateSchedule', () => {
        it('should dispatch to generateByDays when durationType is days', () => {
            const result = generateSchedule({
                startDate: '2024-01-15',
                startTime: '08:00',
                intervalHours: 8,
                durationType: 'days',
                durationValue: 2,
            })
            expect(result.length).toBeGreaterThan(0)
        })

        it('should dispatch to generateByQuantity when durationType is quantity', () => {
            const result = generateSchedule({
                startDate: '2024-01-15',
                startTime: '08:00',
                intervalHours: 8,
                durationType: 'quantity',
                durationValue: 5,
            })
            expect(result).toHaveLength(5)
        })
    })

    describe('getEstimatedEnd', () => {
        it('should return the last dose dateTime', () => {
            const end = getEstimatedEnd({
                startDate: '2024-01-15',
                startTime: '08:00',
                intervalHours: 8,
                durationType: 'quantity',
                durationValue: 3,
            })
            expect(end).toBeTruthy()
            expect(end!.getHours()).toBe(0) // 08:00 + 8 + 8 = 00:00 next day
        })

        it('should return null for empty schedule', () => {
            const end = getEstimatedEnd({
                startDate: '2024-01-15',
                startTime: '08:00',
                intervalHours: 8,
                durationType: 'days',
                durationValue: 0,
            })
            expect(end).toBeNull()
        })
    })
})
