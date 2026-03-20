const STEPS = [
  { label: 'Extracting document structure', detail: 'Parsing headings, sections, procedures' },
  { label: 'Identifying key procedures', detail: 'Finding specific steps, thresholds, tools' },
  { label: 'Building training content', detail: 'Writing step-by-step learning objectives' },
  { label: 'Generating quiz questions', detail: 'Creating evaluation questions from SOP facts' },
  { label: 'Writing narration scripts', detail: 'Generating slide narrations for audio export' },
]

export default function LoadingPanel({ progress, label }) {
  const activeStep = progress < 30 ? 0 : progress < 50 ? 1 : progress < 70 ? 2 : progress < 85 ? 3 : 4

  return (
    <div className="p-10 flex flex-col gap-10">
      <div>
        <span className="block font-mono text-2xs tracking-widest2 uppercase text-muted mb-2">Processing</span>
        <h2 className="font-display text-2xl font-bold tracking-tight mb-6">Analysing Document</h2>
        <div className="h-px bg-paper-3 mb-2 overflow-hidden">
          <div className="h-full bg-ink transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-2xs text-muted">{label || 'Working…'}</span>
          <span className="font-mono text-2xs text-muted">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex flex-col">
        {STEPS.map((step, i) => {
          const isDone   = i < activeStep
          const isActive = i === activeStep
          return (
            <div key={i} className={`grid grid-cols-[48px_1fr] transition-opacity duration-300 ${isDone ? 'opacity-50' : isActive ? 'opacity-100' : 'opacity-20'}`}>
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 border flex items-center justify-center font-mono text-2xs shrink-0 transition-all duration-300 ${isActive ? 'border-ink bg-ink text-paper' : isDone ? 'border-paper-3 bg-paper-2 text-muted' : 'border-paper-3 bg-paper text-muted'}`}>
                  {isDone ? '✓' : String(i + 1).padStart(2, '0')}
                </div>
                {i < STEPS.length - 1 && <div className="w-px flex-1 bg-paper-3 min-h-5" />}
              </div>
              <div className="pb-6 pl-4 pt-1">
                <p className="font-display text-sm font-semibold mb-0.5">{step.label}</p>
                <p className="font-mono text-2xs text-muted">{step.detail}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
