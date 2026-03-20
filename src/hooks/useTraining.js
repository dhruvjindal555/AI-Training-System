import { useState, useCallback } from 'react'
import { generateTrainingContent } from '../lib/gemini'
import { extractTextFromPDF } from '../lib/pdfExtractor'

export function useTraining() {
  const [status, setStatus]   = useState('idle')
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState(null)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')

  const generate = useCallback(async ({ file, sopText, role, experienceLevel, background, depth, quizCount }) => {
    setStatus('loading')
    setError(null)
    setResult(null)
    setProgress(0)

    try {
      let text = sopText

      // PDF extraction 
      if (file && file.type === 'application/pdf') {
        setProgressLabel('Extracting text from PDF…')
        setProgress(10)
        text = await extractTextFromPDF(file)
        if (!text || text.length < 100) throw new Error('Could not extract readable text from this PDF. Try a text-based PDF or paste the content manually.')
      }

      if (!text || text.trim().length < 50) {
        throw new Error('SOP content is too short. Please provide more content.')
      }

      // Progress ticker
      const milestones = [
        { pct: 20, label: 'Reading document structure…' },
        { pct: 40, label: 'Identifying key procedures…' },
        { pct: 60, label: 'Building training content…' },
        { pct: 80, label: 'Generating quiz questions…' },
        { pct: 90, label: 'Finalising narration scripts…' },
      ]
      let mi = 0
      const ticker = setInterval(() => {
        if (mi < milestones.length) {
          setProgress(milestones[mi].pct)
          setProgressLabel(milestones[mi].label)
          mi++
        }
      }, 900)

      const data = await generateTrainingContent({ sopText: text, role, experienceLevel, background, depth, quizCount })

      clearInterval(ticker)
      setProgress(100)
      setProgressLabel('Done!')
      await new Promise((r) => setTimeout(r, 400))
      setResult(data)
      setStatus('success')

    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setResult(null)
    setError(null)
    setProgress(0)
    setProgressLabel('')
  }, [])

  return { status, result, error, progress, progressLabel, generate, reset }
}
