export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[520px] gap-10 px-10">
      <div className="grid grid-cols-2 gap-px bg-paper-3 border border-paper-3 w-36 h-36">
        <div className="bg-ink" /><div className="bg-paper" />
        <div className="bg-paper-2" /><div className="bg-paper-3" />
      </div>
      <div className="text-center">
        <h4 className="font-display text-xl font-bold mb-2">Output appears here</h4>
        <p className="font-display text-sm text-muted max-w-xs leading-relaxed">
          Upload a PDF or paste your SOP, optionally add a trainee profile, then click Generate.
        </p>
      </div>
      <ul className="flex flex-col w-full max-w-xs">
        {['A — Executive Summary', 'B — Key Takeaways', 'C — Training Steps', 'D — Evaluation Quiz'].map((item) => (
          <li key={item} className="flex items-center gap-3 border-b border-paper-3 py-2.5">
            <span className="font-mono text-2xs text-muted w-4">{item[0]}</span>
            <span className="font-mono text-2xs text-paper-3 tracking-wide">{item.slice(4)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
