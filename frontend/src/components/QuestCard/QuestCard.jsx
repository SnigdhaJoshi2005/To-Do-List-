const difficultyBadge = {
  seedling: { icon: "🌱", label: "Seedling", color: "bg-green-100 text-green-700" },
  sprout: { icon: "🌿", label: "Sprout", color: "bg-emerald-100 text-emerald-700" },
  bloom: { icon: "🌺", label: "Bloom", color: "bg-pink-100 text-pink-700" },
};

export default function QuestCard({ quest, onComplete }) {
  const badge = difficultyBadge[quest.difficulty] || difficultyBadge.sprout;

  return (
    <div
      className={`bg-surface border rounded-[var(--radius-lg)] p-4 flex items-center gap-4 transition-all duration-[var(--transition)] hover:shadow-[var(--shadow-sm)] ${
        quest.completed
          ? "border-accent/30 bg-accent/5 opacity-70"
          : "border-border/50 hover:border-accent/40"
      }`}
    >
      <button
        onClick={() => onComplete(quest.id)}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-[var(--transition)] cursor-pointer ${
          quest.completed
            ? "bg-accent border-accent text-white"
            : "border-border hover:border-accent"
        }`}
      >
        {quest.completed && (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m5 13 4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${quest.completed ? "line-through text-dim" : "text-primary"}`}>
          {quest.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
            {badge.icon} {badge.label}
          </span>
          <span className="text-[11px] font-semibold text-dim px-2 py-0.5 rounded-full bg-muted">
            {quest.type === "weekly" ? "📅 Weekly" : "☀️ Daily"}
          </span>
          {quest.dueDate && (
            <span className="text-[11px] text-dim">Due: {quest.dueDate}</span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-xs font-bold text-accent">+{quest.xp} XP</p>
        <p className="text-[11px] font-semibold text-amber-600">+{quest.seeds} 🌰</p>
      </div>
    </div>
  );
}
