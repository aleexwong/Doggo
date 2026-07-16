/** Paw-print logo mark, drawn inline so it inherits currentColor. */
export function PawMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {/* four toes in an arc above the pad */}
      <ellipse cx="4.6" cy="10.6" rx="2.0" ry="2.7" transform="rotate(-28 4.6 10.6)" />
      <ellipse cx="9.5" cy="6.6" rx="2.1" ry="2.9" transform="rotate(-9 9.5 6.6)" />
      <ellipse cx="14.5" cy="6.6" rx="2.1" ry="2.9" transform="rotate(9 14.5 6.6)" />
      <ellipse cx="19.4" cy="10.6" rx="2.0" ry="2.7" transform="rotate(28 19.4 10.6)" />
      {/* main pad */}
      <path d="M12 12.2c2.3 0 4 1.4 5 3.1.9 1.4 2.1 2.5 2.1 4.2 0 2-1.7 3.3-3.6 3.3-1.4 0-2.4-.8-3.5-.8s-2.1.8-3.5.8c-1.9 0-3.6-1.3-3.6-3.3 0-1.7 1.2-2.8 2.1-4.2 1-1.7 2.7-3.1 5-3.1Z" />
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
