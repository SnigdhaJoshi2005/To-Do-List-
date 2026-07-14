export default function VineBar({ current, max, label }) {
  const percent = max > 0 ? Math.min(100, (current / max) * 100) : 0;

  return (
    <div className="w-full">
      <div className="h-3 rounded-full bg-muted border border-border/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {label && (
        <p className="text-xs text-dim font-semibold mt-1.5 text-right">{label}</p>
      )}
    </div>
  );
}
