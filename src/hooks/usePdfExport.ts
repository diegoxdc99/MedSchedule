import { useState } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'


export const usePdfExport = () => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const exportPdf = async (element: HTMLElement, fileName: string = 'document') => {
        setIsGenerating(true)
        setError(null)
        try {
            // Find all page sheets
            const pages = element.querySelectorAll('.print-sheet') as NodeListOf<HTMLElement>

            if (pages.length === 0) {
                // Fallback: print the container itself if no sheets found
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff'
                })
                const imgData = canvas.toDataURL('image/png')
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                })
                const pdfWidth = pdf.internal.pageSize.getWidth()
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
                pdf.save(`${fileName}.pdf`)
                return
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

            pdf.save(`${fileName}.pdf`)
        } catch (err) {
            console.error('Failed to generate PDF', err)
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setIsGenerating(false)
        }
    }

    return { exportPdf, isGenerating, error }
}
