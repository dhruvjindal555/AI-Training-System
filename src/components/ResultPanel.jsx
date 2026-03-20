import { useState } from 'react'
import { Download, Copy, RotateCcw, ChevronDown, ChevronUp, Loader, Presentation, Sparkles } from 'lucide-react'
import { exportToPPTX } from '../lib/pptxExport'

const DIFF = {
  easy:   'bg-accent-green-bg text-accent-green border-accent-green',
  medium: 'bg-accent-amber-bg text-accent-amber border-accent-amber',
  hard:   'bg-accent-red-bg  text-accent-red   border-accent-red',
}

function PersonalizedBadge() {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-2xs text-accent-blue bg-accent-blue-bg px-2 py-0.5 ml-2 shrink-0">
      <Sparkles size={9} />personalized
    </span>
  )
}

function SectionHead({ idx, title }) {
  return (
    <div className="flex items-baseline gap-4 mb-5">
      <span className="font-mono text-2xs text-muted w-5 shrink-0">{idx}</span>
      <h3 className="font-display text-2xs font-bold tracking-widest2 uppercase text-muted-2">{title}</h3>
    </div>
  )
}

function buildMarkdown(r) {
  let md = `# ${r.title}\n`
  if (r.department) md += `**Department:** ${r.department}\n`
  if (r.sopNumber)  md += `**SOP Number:** ${r.sopNumber}\n`
  if (r.version)    md += `**Version:** ${r.version}\n`
  md += `\n---\n\n## Executive Summary\n${r.summary}\n\n`
  md += `## Key Takeaways\n${(r.keyPoints||[]).map(k=>`- ${k.point}`).join('\n')}\n\n`
  md += `## Training Steps\n${(r.trainingSteps||[]).map((s,i)=>`### ${i+1}. ${s.title}\n**Tag:** ${s.tag||'—'}\n\n${s.description}`).join('\n\n')}\n\n`
  md += `## Evaluation Questions\n${(r.quizQuestions||[]).map((q,i)=>`**Q${i+1} [${q.difficulty}]: ${q.question}**\n> ${q.answer}${q.referencedSection ? `\n> *Ref: ${q.referencedSection}*` : ''}`).join('\n\n')}\n`
  return md
}

function buildPlainText(r) {
  return [
    r.title, r.department || '', '',
    'SUMMARY', r.summary, '',
    'KEY POINTS', ...(r.keyPoints||[]).map((k,i)=>`${i+1}. ${k.point}`), '',
    'TRAINING STEPS', ...(r.trainingSteps||[]).map((s,i)=>`${i+1}. ${s.title}\n   ${s.description}`), '',
    'QUIZ', ...(r.quizQuestions||[]).map((q,i)=>`Q${i+1}: ${q.question}\nA: ${q.answer}`),
  ].join('\n')
}

export default function ResultPanel({ result: r, onReset }) {
  const [openQuiz, setOpenQuiz]       = useState(null)
  const [copied, setCopied]           = useState(false)
  const [pptxLoading, setPptxLoading] = useState(false)

  const hasPersonalization = (r.keyPoints||[]).some(k=>k.personalized) ||
    (r.trainingSteps||[]).some(s=>s.personalized) || r.personalizedSummary

  const handleExportMarkdown = () => {
    const blob = new Blob([buildMarkdown(r)], { type: 'text/markdown' })
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: (r.title||'training').replace(/\s+/g,'-').toLowerCase()+'.md'
    })
    a.click()
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildPlainText(r))
    setCopied(true)
    setTimeout(()=>setCopied(false), 2000)
  }

  const handlePPTX = async () => {
    setPptxLoading(true)
    try { await exportToPPTX(r) }
    catch(e) { alert('PPTX export failed: ' + e.message) }
    finally { setPptxLoading(false) }
  }

  return (
    <div className="flex flex-col">

      {/* ── Result Header ───────────────────────── */}
      <div className="px-10 py-8 border-b border-ink">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="font-mono text-2xs tracking-widest px-2.5 py-1 bg-accent-green-bg text-accent-green uppercase">✓ Generated</span>
          {r.department && <span className="font-mono text-2xs text-muted tracking-widest uppercase">{r.department}</span>}
          {r.sopNumber  && <span className="font-mono text-2xs text-paper-3">SOP {r.sopNumber}</span>}
          {r.version    && <span className="font-mono text-2xs text-paper-3">v{r.version}</span>}
          {hasPersonalization && (
            <span className="inline-flex items-center gap-1 font-mono text-2xs text-accent-blue bg-accent-blue-bg px-2.5 py-1 uppercase">
              <Sparkles size={10} /> Personalized
            </span>
          )}
        </div>

        <h2 className="font-display text-3xl font-bold tracking-tight leading-tight mb-4">{r.title}</h2>

        <div className="flex items-center gap-3 font-mono text-2xs text-muted flex-wrap">
          <span><strong className="font-display text-xs font-bold text-ink">{(r.trainingSteps||[]).length}</strong> steps</span>
          <span className="text-paper-3">·</span>
          <span><strong className="font-display text-xs font-bold text-ink">{(r.quizQuestions||[]).length}</strong> questions</span>
          <span className="text-paper-3">·</span>
          <span><strong className="font-display text-xs font-bold text-ink">{(r.keyPoints||[]).length}</strong> key points</span>
        </div>
      </div>

      {/* ── Export Bar ──────────────────────────── */}
      <div className="flex items-center justify-between px-10 py-3 border-b border-ink bg-paper-2 flex-wrap gap-3">
        <span className="font-mono text-2xs tracking-widest2 uppercase text-muted font-semibold">Export</span>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 h-8 px-3 border border-paper-3 bg-paper font-display text-2xs font-semibold tracking-widest uppercase hover:border-ink hover:bg-ink hover:text-paper transition-all duration-150">
            <Download size={11} /> Markdown
          </button>

          <button onClick={handleCopy}
            className="flex items-center gap-1.5 h-8 px-3 border border-paper-3 bg-paper font-display text-2xs font-semibold tracking-widest uppercase hover:border-ink hover:bg-ink hover:text-paper transition-all duration-150">
            <Copy size={11} /> {copied ? 'Copied ✓' : 'Copy All'}
          </button>

          <button onClick={handlePPTX} disabled={pptxLoading}
            className="flex items-center gap-1.5 h-8 px-3 border border-ink bg-ink text-paper font-display text-2xs font-semibold tracking-widest uppercase hover:bg-muted-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed">
            {pptxLoading ? <Loader size={11} className="animate-spin" /> : <Presentation size={11} />}
            {pptxLoading ? 'Building…' : 'Slides .pptx'}
          </button>

          <button onClick={onReset}
            className="flex items-center gap-1.5 h-8 px-3 border border-paper-3 bg-paper font-display text-2xs font-semibold tracking-widest uppercase hover:border-ink hover:bg-ink hover:text-paper transition-all duration-150">
            <RotateCcw size={11} /> New SOP
          </button>
        </div>
      </div>

      {/* ── Section A: Summary ──────────────────── */}
      <div className="px-10 py-8 border-b border-paper-3">
        <SectionHead idx="A" title="Executive Summary" />
        <div className="pl-9">
          {r.personalizedSummary && (
            <div className="mb-3 flex items-center gap-2 font-mono text-2xs text-accent-blue">
              <Sparkles size={10} /> This summary was tailored to your role and background
            </div>
          )}
          <p className="font-serif text-lg leading-relaxed text-muted-2 italic">{r.summary}</p>
        </div>
      </div>

      {/* ── Section B: Key Points ───────────────── */}
      <div className="px-10 py-8 border-b border-paper-3">
        <SectionHead idx="B" title="Key Takeaways" />
        <ul className="pl-9 flex flex-col">
          {(r.keyPoints||[]).map((kp, i) => (
            <li key={i} className="flex gap-3 items-start py-3 border-b border-paper-3 last:border-0 text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-ink shrink-0 mt-2" />
              <span className="flex-1">{kp.point}</span>
              {kp.personalized && <PersonalizedBadge />}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Section C: Training Steps ───────────── */}
      <div className="px-10 py-8 border-b border-paper-3">
        <SectionHead idx="C" title="Training Steps" />
        <ol className="pl-9 flex flex-col">
          {(r.trainingSteps||[]).map((step, i) => (
            <li key={i} className="grid grid-cols-[44px_1fr] py-5 border-b border-paper-3 last:border-0 items-start">
              <span className="font-mono text-2xl font-light text-paper-3 leading-tight pt-0.5">
                {String(i+1).padStart(2,'0')}
              </span>
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-display text-sm font-bold">{step.title}</span>
                  {step.tag && (
                    <span className="font-mono text-2xs tracking-widest uppercase px-2 py-0.5 bg-paper-2 border border-paper-3 text-muted">
                      {step.tag}
                    </span>
                  )}
                  {step.personalized && <PersonalizedBadge />}
                </div>
                <p className="text-sm text-muted-2 leading-relaxed">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Section D: Quiz ─────────────────────── */}
      <div className="px-10 py-8">
        <SectionHead idx="D" title="Evaluation Questions" />
        <ul className="pl-9 flex flex-col gap-2">
          {(r.quizQuestions||[]).map((q, i) => (
            <li key={i} className="border border-paper-3">
              <button
                className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-paper-2 transition-colors duration-150"
                onClick={() => setOpenQuiz(openQuiz === i ? null : i)}
              >
                <div className="flex gap-4 items-start flex-1">
                  <span className="font-mono text-2xs text-muted shrink-0 pt-0.5 tracking-wide">Q{String(i+1).padStart(2,'0')}</span>
                  <p className="font-display text-sm font-medium leading-snug">{q.question}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {q.difficulty && (
                    <span className={`font-mono text-2xs uppercase tracking-widest px-2 py-0.5 border ${DIFF[q.difficulty]||DIFF.medium}`}>
                      {q.difficulty}
                    </span>
                  )}
                  {openQuiz === i ? <ChevronUp size={15} className="text-muted" /> : <ChevronDown size={15} className="text-muted" />}
                </div>
              </button>

              {openQuiz === i && (
                <div className="border-t border-paper-3 px-4 py-4 bg-paper-2">
                  <span className="block font-mono text-2xs uppercase tracking-widest text-muted mb-2">Answer</span>
                  <p className="text-sm text-muted-2 leading-relaxed mb-2">{q.answer}</p>
                  {q.referencedSection && (
                    <p className="font-mono text-2xs text-paper-3">Ref: {q.referencedSection}</p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}