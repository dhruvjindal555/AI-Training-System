import { useRef, useState } from 'react'
import { UploadCloud, ChevronRight, FileText, X, User } from 'lucide-react'

const DEPTH_OPTS  = [{ value: 'standard', label: 'Standard', sub: '4–6 steps' }, { value: 'detailed', label: 'Detailed', sub: '6–8 steps' }]
const QUIZ_OPTS   = [{ value: '3', label: '3', sub: 'Questions' }, { value: '5', label: '5', sub: 'Questions' }]
const EXP_OPTS    = [{ value: 'beginner', label: 'Beginner' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'expert', label: 'Expert' }]

export default function InputPanel({ onGenerate, isLoading }) {
  const [sopText, setSopText]           = useState('')
  const [file, setFile]                 = useState(null)
  const [role, setRole]                 = useState('')
  const [experienceLevel, setExp]       = useState('')
  const [background, setBackground]     = useState('')
  const [depth, setDepth]               = useState('standard')
  const [quizCount, setQuizCount]       = useState('3')
  const [dragOver, setDragOver]         = useState(false)
  const [showPersonal, setShowPersonal] = useState(false)
  const fileRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    if (f.type !== 'application/pdf') {
      const reader = new FileReader()
      reader.onload = (e) => setSopText(e.target.result)
      reader.readAsText(f)
    }
  }

  const clearFile = () => { setFile(null); setSopText(''); if (fileRef.current) fileRef.current.value = '' }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const canSubmit = (file || sopText.trim().length > 50) && !isLoading

  const hasPersonalization = role || experienceLevel || background

  return (
    <aside className="border-r border-ink flex flex-col overflow-y-auto">
      {/* Panel Header */}
      <div className="px-8 py-7 border-b border-ink sticky top-0 bg-paper z-10">
        <span className="block font-mono text-2xs tracking-widest2 text-muted uppercase mb-1">01 — Input</span>
        <h2 className="font-display text-2xl font-bold tracking-tight">SOP Document</h2>
      </div>

      <div className="px-8 py-7 flex flex-col gap-5 flex-1">

        {/* ── File Upload ──────────────────────── */}
        {!file ? (
          <div
            className={`border border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${dragOver ? 'border-ink bg-paper-2' : 'border-paper-3 hover:border-ink hover:bg-paper-2'}`}
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input ref={fileRef} type="file" accept=".txt,.md,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            <UploadCloud className="mx-auto mb-2 text-muted" size={22} />
            <p className="text-sm text-muted-2"><span className="font-semibold text-ink">Drop file</span> or click to upload</p>
            <p className="font-mono text-2xs text-muted tracking-widest mt-1">.PDF · .TXT · .MD</p>
          </div>
        ) : (
          <div className="border border-ink bg-paper-2 px-4 py-3 flex items-center gap-3">
            <FileText size={16} className="text-muted shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm font-semibold truncate">{file.name}</p>
              <p className="font-mono text-2xs text-muted">{(file.size / 1024).toFixed(1)} KB · {file.type === 'application/pdf' ? 'PDF — text will be extracted automatically' : 'Text file'}</p>
            </div>
            <button onClick={clearFile} className="text-muted hover:text-ink transition-colors shrink-0"><X size={14} /></button>
          </div>
        )}

        {/* ── Divider ──────────────────────────── */}
        <div className="flex items-center gap-4 text-2xs text-muted uppercase tracking-widest2">
          <span className="flex-1 h-px bg-paper-3" />
          <span>or paste below</span>
          <span className="flex-1 h-px bg-paper-3" />
        </div>

        {/* ── Textarea ─────────────────────────── */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="font-mono text-2xs tracking-widest2 uppercase text-muted font-semibold">SOP Content</label>
            <span className="font-mono text-2xs text-paper-3">{sopText.length.toLocaleString()} chars</span>
          </div>
          <textarea
            className="font-mono text-xs leading-relaxed bg-paper border border-ink p-4 resize-y outline-none focus:bg-paper-2 placeholder:text-muted placeholder:italic transition-colors min-h-40"
            value={sopText}
            onChange={(e) => { setSopText(e.target.value); setFile(null) }}
            rows={8}
            placeholder={`Title: Customer Onboarding Process\nPurpose: Ensure consistent client onboarding...\n\nProcedure:\n1. Send welcome email within 24 hours\n2. Schedule kickoff call within 3 days\n...`}
          />
        </div>

        {/* ── Personalization (collapsible) ────── */}
        <div className="border border-paper-3">
          <button
            className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${showPersonal ? 'bg-paper-2' : 'hover:bg-paper-2'}`}
            onClick={() => setShowPersonal(!showPersonal)}
          >
            <div className="flex items-center gap-2">
              <User size={13} className={hasPersonalization ? 'text-accent-blue' : 'text-muted'} />
              <span className="font-mono text-2xs tracking-widest2 uppercase font-semibold text-muted">
                Trainee Profile
              </span>
              {hasPersonalization && (
                <span className="font-mono text-2xs text-accent-blue bg-accent-blue-bg px-2 py-0.5 tracking-wide">Active</span>
              )}
              <span className="font-mono text-2xs text-paper-3 ml-1">Optional</span>
            </div>
            <span className="font-mono text-2xs text-muted">{showPersonal ? '−' : '+'}</span>
          </button>

          {showPersonal && (
            <div className="border-t border-paper-3 px-4 py-4 flex flex-col gap-4 bg-paper">
              <p className="font-mono text-2xs text-muted leading-relaxed">
                Providing this info personalises the training content and quiz to match the trainee's background.
                Fields marked with ✦ in the output indicate personalised content.
              </p>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-2xs tracking-widest2 uppercase text-muted font-semibold">Job Role / Title</label>
                <input
                  className="font-display text-sm bg-paper border border-ink h-10 px-3 outline-none focus:bg-paper-2 placeholder:text-muted transition-colors w-full"
                  type="text" value={role} onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Customer Success Manager"
                />
              </div>

              {/* Experience Level */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-2xs tracking-widest2 uppercase text-muted font-semibold">Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {EXP_OPTS.map((opt) => (
                    <button key={opt.value} onClick={() => setExp(experienceLevel === opt.value ? '' : opt.value)}
                      className={`border py-2 font-display text-xs font-semibold transition-all duration-150 ${experienceLevel === opt.value ? 'border-ink bg-ink text-paper' : 'border-paper-3 hover:border-ink bg-paper'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-2xs tracking-widest2 uppercase text-muted font-semibold">Prior Knowledge / Background</label>
                <textarea
                  className="font-display text-sm bg-paper border border-ink p-3 outline-none focus:bg-paper-2 placeholder:text-muted transition-colors resize-none"
                  rows={2} value={background} onChange={(e) => setBackground(e.target.value)}
                  placeholder="e.g. 2 years in sales, familiar with Salesforce CRM but new to this SOP process…"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Output Options ───────────────────── */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-2xs tracking-widest2 uppercase text-muted font-semibold">Training Depth</label>
          <div className="grid grid-cols-2 gap-2">
            {DEPTH_OPTS.map((opt) => (
              <button key={opt.value} onClick={() => setDepth(opt.value)}
                className={`border p-3 text-left flex flex-col gap-0.5 transition-all duration-150 ${depth === opt.value ? 'border-ink bg-ink text-paper' : 'border-paper-3 hover:border-ink bg-paper'}`}>
                <span className="font-display text-sm font-bold">{opt.label}</span>
                <span className="font-mono text-2xs text-muted">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-2xs tracking-widest2 uppercase text-muted font-semibold">Quiz Questions</label>
          <div className="grid grid-cols-2 gap-2">
            {QUIZ_OPTS.map((opt) => (
              <button key={opt.value} onClick={() => setQuizCount(opt.value)}
                className={`border p-3 text-left flex flex-col gap-0.5 transition-all duration-150 ${quizCount === opt.value ? 'border-ink bg-ink text-paper' : 'border-paper-3 hover:border-ink bg-paper'}`}>
                <span className="font-display text-sm font-bold">{opt.label}</span>
                <span className="font-mono text-2xs text-muted">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Submit ───────────────────────────── */}
        <button
          onClick={() => onGenerate({ file, sopText, role, experienceLevel, background, depth, quizCount })}
          disabled={!canSubmit}
          className="mt-2 w-full h-14 bg-ink text-paper font-display text-xs font-semibold tracking-widest2 uppercase border border-ink flex items-center justify-between px-6 transition-all duration-200 hover:bg-muted-2 disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          <span>{isLoading ? 'Processing…' : 'Generate Training'}</span>
          {!isLoading && <ChevronRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />}
        </button>
      </div>
    </aside>
  )
}
