import { useTraining } from './hooks/useTraining'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import LoadingPanel from './components/LoadingPanel'
import EmptyState from './components/EmptyState'
import ResultPanel from './components/ResultPanel'
import { AlertCircle } from 'lucide-react'

export default function App() {
  const { status, result, error, progress, progressLabel, generate, reset } = useTraining()

  const renderOutput = () => {
    switch (status) {
      case 'loading':
        return <LoadingPanel progress={progress} label={progressLabel} />
      case 'success':
        return <ResultPanel result={result} onReset={reset} />
      case 'error':
        return (
          <div className="flex flex-col">
            <div className="mx-10 mt-10 border border-accent-red bg-accent-red-bg px-5 py-4 flex gap-3 items-start">
              <AlertCircle size={15} className="text-accent-red shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-sm font-semibold text-accent-red mb-1">Generation Failed</p>
                <p className="font-mono text-2xs text-accent-red leading-relaxed">{error}</p>
              </div>
            </div>
            <EmptyState />
          </div>
        )
      default:
        return <EmptyState />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Header />

      <div className="border-b border-ink">
        <div className="max-w-screen-xl mx-auto px-12 py-14 grid grid-cols-2 gap-0">
          <div className="border-r border-ink pr-16">
            <p className="font-mono text-2xs tracking-widest2 uppercase text-muted mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-muted inline-block" />What This Does
            </p>
            <h2 className="font-display text-5xl font-extrabold tracking-tight leading-[1.02] mb-5">
              Turn any SOP into a complete training system.
            </h2>
            <p className="font-display text-base text-muted-2 leading-relaxed max-w-md">
              Upload a PDF or paste your SOP. Gemini 2.5 Flash Lite extracts specific procedures, builds
              personalised training content, generates quiz questions with section references, exports
              a slide deck, and produces a narrated audio module.
            </p>
          </div>

          <div className="pl-16 flex flex-col justify-end">
            <ul className="flex flex-col">
              {[
                ['01', 'Upload PDF or paste SOP text'],
                ['02', 'Optionally add trainee profile for personalisation'],
                ['03', 'Gemini 2.5 Flash Lite generates specific, grounded content'],
                ['04', 'Export slides (.pptx)'],
              ].map(([num, text]) => (
                <li key={num} className="grid grid-cols-[40px_1fr] gap-4 items-center py-4 border-b border-paper-3 first:border-t">
                  <span className="font-mono text-2xs text-muted">{num}</span>
                  <span className="font-display text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-screen-xl mx-auto w-full grid grid-cols-[440px_1fr] border-b border-ink">
        <InputPanel onGenerate={generate} isLoading={status === 'loading'} />
        <main className="overflow-y-auto min-h-0">
          {renderOutput()}
        </main>
      </div>
      
      <footer className="border-t border-ink">
        <div className="max-w-screen-xl mx-auto px-12 h-12 flex items-center justify-between">
          <span className="font-mono text-2xs text-muted">SOP Training System v2.0 — Gemini 2.5 Flash Lite</span>
          <span className="font-mono text-2xs text-muted uppercase tracking-widest">AI Automation Assessment</span>
        </div>
      </footer>
    </div>
  )
}
