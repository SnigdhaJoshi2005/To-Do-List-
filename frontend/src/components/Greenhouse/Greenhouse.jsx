export default function Greenhouse({ items, compact = false, onClick }) {
  const placed = items.filter((i) => i.owned && i.placed);

  return (
    <div
      className={`bg-surface/80 border border-border/40 rounded-[var(--radius-xl)] overflow-hidden transition-all duration-[var(--transition)] ${
        compact ? "p-4 cursor-pointer hover:border-accent/40 hover:shadow-[var(--shadow-sm)]" : "p-6"
      }`}
      onClick={onClick}
    >
      {compact && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-dim uppercase tracking-wider">Garden</span>
          <span className="text-[11px] text-accent font-semibold">View All →</span>
        </div>
      )}

      {placed.length === 0 ? (
        <div className="text-center py-6">
          <span className="text-4xl block mb-2">🏡</span>
          <p className="text-xs text-dim font-semibold">
            {compact ? "Visit your garden" : "No items placed yet. Buy items from the shop!"}
          </p>
        </div>
      ) : (
        <div className={`grid ${compact ? "grid-cols-6" : "grid-cols-4 sm:grid-cols-6"} gap-2`}>
          {placed.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="aspect-square bg-muted/60 rounded-[var(--radius-md)] flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200"
              title={item.name}
            >
              {item.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
