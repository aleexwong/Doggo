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

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="statusbar">
          <Clock />
          <div className="statusbar-icons" aria-hidden="true">
            <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
              <path d="M7 12 0 4.5A10.5 10.5 0 0 1 14 4.5Z" />
            </svg>
            <svg width="20" height="10" viewBox="0 0 24 12" fill="none" stroke="currentColor">
              <rect x="1" y="1" width="19" height="10" rx="2.5" strokeWidth="1.5" />
              <rect x="3" y="3" width="13" height="6" rx="1" fill="currentColor" stroke="none" />
              <path d="M22 4v4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="camera" aria-hidden="true" />
        <div className="app-area">{children}</div>
        <div className="gesturebar" aria-hidden="true">
          <div className="gesturebar-pill" />
        </div>
      </div>
    </div>
  )
}
