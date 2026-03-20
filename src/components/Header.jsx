import { useEffect, useState } from 'react'

export default function Header() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="border-b border-ink sticky top-0 z-50 bg-paper">
      <div className="max-w-screen-xl mx-auto px-12 grid grid-cols-[1fr_auto_1fr] items-stretch h-14">
        <div className="flex items-center gap-3 border-r border-ink pr-6">
          <span className="font-mono text-2xs tracking-widest2 text-muted uppercase">SOP/TRN</span>
          <span className="font-mono text-2xs text-paper-3">v2.0</span>
        </div>
        <div className="flex items-center justify-center px-12">
          <h1 className="font-display text-xs font-semibold tracking-widest2 uppercase">AI Training System</h1>
        </div>
        <div className="flex items-center justify-end border-l border-ink pl-6">
          <span className="font-mono text-2xs text-muted tracking-wide">{time}</span>
        </div>
      </div>
    </header>
  )
}
