/** Paw-print logo mark, drawn inline so it inherits currentColor. */
export function PawMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {/* toes */}
      <ellipse cx="7.2" cy="7.4" rx="2.1" ry="2.9" transform="rotate(-18 7.2 7.4)" />
      <ellipse cx="16.8" cy="7.4" rx="2.1" ry="2.9" transform="rotate(18 16.8 7.4)" />
      <ellipse cx="3.4" cy="12.2" rx="1.8" ry="2.5" transform="rotate(-32 3.4 12.2)" />
      <ellipse cx="20.6" cy="12.2" rx="1.8" ry="2.5" transform="rotate(32 20.6 12.2)" />
      {/* pad */}
      <path d="M12 10.6c2.9 0 4.4 2.2 5.5 4 .9 1.5 2 2.6 2 4.2 0 1.9-1.5 3.2-3.4 3.2-1.6 0-2.6-.9-4.1-.9s-2.5.9-4.1.9c-1.9 0-3.4-1.3-3.4-3.2 0-1.6 1.1-2.7 2-4.2 1.1-1.8 2.6-4 5.5-4Z" />
    </svg>
  )
}

/** "Doggo" wordmark + paw, used in the app bar, boot, and hero. */
export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span className="wordmark" style={{ fontSize: size }}>
      <PawMark size={size * 1.05} />
      Doggo
    </span>
  )
}
