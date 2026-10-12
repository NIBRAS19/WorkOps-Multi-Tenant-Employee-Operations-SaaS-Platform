export function ProgressBar({ value, label, meta }: { value: number; label?: string; meta?: string }) {
  return <div className="progress-wrap">{(label || meta) && <div className="progress-meta"><span>{label}</span><span>{meta}</span></div>}<div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div></div>
}
