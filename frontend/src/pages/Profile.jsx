import { useGame } from "../context/GameStateContext";
import VineBar from "../components/VineBar/VineBar";

export default function Profile() {
  const { username, level, xp, xpForNextLevel, seeds, streak, totalCompleted, avatar, setAvatar, inventory, logout } = useGame();

  const ownedCount = inventory.filter((i) => i.owned).length;
  const placedCount = inventory.filter((i) => i.owned && i.placed).length;

  return (
    <div className="py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <h1 className="text-3xl font-semibold text-primary mb-6">Profile</h1>

      <div className="bg-surface border border-border rounded-[var(--radius-xl)] p-7 mb-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-alt to-accent-alt-hover flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(212,165,165,0.3)]">
            <span className="text-4xl leading-none">🧙‍♀️</span>
          </div>
          <div className="flex-1">
            <h2 className="text-[28px] font-semibold text-primary mb-1">{username}</h2>
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-accent to-accent-hover text-white px-3 py-1 rounded-xl text-xs font-bold shadow-[0_2px_6px_rgba(184,164,114,0.25)]">
              🌱 Lv.{level}
            </span>
          </div>
        </div>
        <div className="mb-6">
          <VineBar current={xp} max={xpForNextLevel} label={`${xp}/${xpForNextLevel} XP`} />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
          {[
            { icon: "🌰", value: seeds, label: "Seeds" },
            { icon: "🔥", value: streak, label: "Day Streak" },
            { icon: "✅", value: totalCompleted, label: "Completed" },
            { icon: "🏡", value: `${placedCount}/${ownedCount}`, label: "Items Placed" },
          ].map((s) => (
            <div key={s.label} className="text-center py-4 bg-muted/80 rounded-[var(--radius-lg)] border border-border/30 transition-all duration-200 hover:shadow-[var(--shadow-sm)] hover:-translate-y-px">
              <span className="block text-2xl mb-1.5">{s.icon}</span>
              <span className="block text-xl font-extrabold text-primary tabular-nums">{s.value}</span>
              <span className="text-[11px] text-dim font-semibold uppercase tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[var(--radius-xl)] p-7 mb-5 shadow-[var(--shadow-sm)]">
        <h3 className="text-xl font-semibold text-primary mb-5">Customization</h3>
        <div className="flex flex-col gap-5">
          {[
            { label: "Outfit", key: "outfit", options: [{ value: "default", icon: "🧥" }, { value: "robe", icon: "🧙" }, { value: "overalls", icon: "👩‍🌾" }] },
            { label: "Hair", key: "hair", options: [{ value: "default", icon: "💇" }, { value: "long", icon: "💁" }, { value: "curly", icon: "🦱" }] },
            { label: "Accessory", key: "accessory", options: [{ value: "none", icon: "🚫" }, { value: "crown", icon: "👑" }, { value: "glasses", icon: "👓" }] },
          ].map((group) => (
            <div key={group.key} className="flex flex-col gap-2.5">
              <label className="text-sm font-semibold text-secondary">{group.label}</label>
              <div className="flex gap-2.5">
                {group.options.map((o) => (
                  <button
                    key={o.value}
                    className={`w-14 h-14 rounded-[var(--radius-lg)] bg-muted border-2 border-border flex items-center justify-center text-2xl transition-all duration-200 hover:border-accent-alt hover:scale-105 active:scale-95 ${
                      avatar[group.key] === o.value ? "border-accent-alt bg-accent-alt/12 shadow-[0_0_0_3px_rgba(212,165,165,0.2)]" : ""
                    }`}
                    onClick={() => setAvatar((p) => ({ ...p, [group.key]: o.value }))}
                  >
                    {o.icon}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-sm)]">
        <h3 className="text-xl font-semibold text-primary mb-5">Inventory</h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
          {inventory.filter((i) => i.owned).map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-1.5 py-4 bg-muted/80 rounded-[var(--radius-lg)] border border-border/30 transition-all duration-200 hover:shadow-[var(--shadow-sm)] hover:-translate-y-px">
              <span className="text-[28px] leading-none">{item.icon}</span>
              <span className="text-xs font-bold text-primary">{item.name}</span>
              <span className="text-[11px] text-dim font-semibold">{item.placed ? "🌿 Placed" : "📦 Stored"}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full mt-5 px-6 py-3 bg-red-500/10 border border-red-300 text-red-600 rounded-[var(--radius-xl)] font-semibold text-sm hover:bg-red-500/20 transition-all active:scale-95 cursor-pointer"
      >
        Log Out
      </button>
    </div>
  );
}
