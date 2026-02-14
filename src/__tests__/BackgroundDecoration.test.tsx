import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BackgroundDecoration from '../components/BackgroundDecoration'

describe('BackgroundDecoration', () => {
    it('should render with aria-hidden', () => {
        const { container } = render(<BackgroundDecoration />)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper.getAttribute('aria-hidden')).toBe('true')
    })

    it('should render two gradient blobs', () => {
        const { container } = render(<BackgroundDecoration />)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper.children).toHaveLength(2)
    })

    it('should have fixed positioning', () => {
        const { container } = render(<BackgroundDecoration />)
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper.className).toContain('fixed')
    })
})
