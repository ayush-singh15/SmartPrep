export default function ProgressBar({ value = 0, max = 100, color = 'primary', height = 6 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="progress-track" style={{ height }}>
      <div
        className={`progress-fill ${color !== 'primary' ? color : ''}`}
        style={{ width: `${pct}%`, height }}
      />
    </div>
  )
}
