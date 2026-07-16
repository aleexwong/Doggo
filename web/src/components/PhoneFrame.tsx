import { ReactNode, useEffect, useState } from 'react'

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])
  return (
    <span>
      {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
    </span>
  )
}

export function PhoneFrame({
  children,
  dark = false,
}: {
  children: ReactNode
  /** Dark status bar content (for dark screens like boot) */
  dark?: boolean
}) {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className={`statusbar ${dark ? 'statusbar-dark' : ''}`}>
          <Clock />
          <div className="statusbar-icons" aria-hidden="true">
            {/* signal */}
            <svg width="14" height="12" viewBox="0 0 14 14" fill="currentColor">
              <path d="M14 0 0 14h14Z" />
            </svg>
            {/* wifi */}
            <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
              <path d="M7 12 0 4.5A10.5 10.5 0 0 1 14 4.5Z" />
            </svg>
            {/* battery */}
            <svg width="9" height="14" viewBox="0 0 10 16" fill="currentColor">
              <path d="M3 0h4v1.5h2A1 1 0 0 1 10 2.5v12.5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V2.5a1 1 0 0 1 1-1h2Z" />
            </svg>
          </div>
        </div>
        <div className="camera" aria-hidden="true" />
        <div className="app-area">{children}</div>
        <div className={`gesturebar ${dark ? 'gesturebar-dark' : ''}`} aria-hidden="true">
          <div className="gesturebar-pill" />
        </div>
      </div>
    </div>
  )
}

/** Material-style top app bar shown on in-app screens. */
export function AppBar({
  title,
  onBack,
  trailing,
}: {
  title: ReactNode
  onBack?: () => void
  trailing?: ReactNode
}) {
  return (
    <header className="appbar">
      {onBack && (
        <button className="appbar-icon" onClick={onBack} aria-label="Back">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
      )}
      <span className="appbar-title">{title}</span>
      <span className="appbar-trailing">{trailing}</span>
    </header>
  )
}
