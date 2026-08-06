import { useEffect, useState } from "react";
import { RiSeedlingLine } from "react-icons/ri";
import { GiSpotedFlower } from "react-icons/gi";
import { TbPlant2 } from "react-icons/tb";
import { PiAcornDuotone, PiSunDuotone, PiCalendarDuotone, PiTimerDuotone } from "react-icons/pi";

const difficultyBadge = {
  seedling: { icon: <RiSeedlingLine />, label: "Seedling", color: "bg-[rgba(128,199,121,0.15)] text-[#80C779]", bar: "#80C779" },
  sprout: { icon: <TbPlant2 />, label: "Sprout", color: "bg-[rgba(238,144,249,0.15)] text-[#EE90F9]", bar: "#EE90F9" },
  bloom: { icon: <GiSpotedFlower />, label: "Bloom", color: "bg-[rgba(250,143,209,0.15)] text-[#FA8FD1]", bar: "#FA8FD1" },
};

function todayStr() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function formatCountdown(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export default function QuestCard({ quest, onComplete }) {
  const badge = difficultyBadge[quest.difficulty] || difficultyBadge.sprout;
  const [now, setNow] = useState(Date.now());

  const expired = !quest.completed && quest.expiresDay && todayStr() >= quest.expiresDay;
  const ready = quest.completed || !quest.readyAt || now >= quest.readyAt;
  const waiting = !quest.completed && !expired && !ready;

  useEffect(() => {
    if (!waiting) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [waiting]);

  return (
    <div
      style={{ borderLeftColor: badge.bar }}
      className={`bg-surface border border-l-4 rounded-[var(--radius-lg)] p-4 flex items-center gap-4 transition-all duration-[var(--transition)] ${
        quest.completed
          ? "border-[#80C779]/30 bg-[rgba(128,199,121,0.07)] opacity-80"
          : expired
          ? "border-[#ef7d7d]/40 bg-[rgba(239,125,125,0.06)]"
          : "border-border/50 hover:border-accent/40 hover:shadow-[var(--shadow-md)] hover:-translate-y-1"
      }`}
    >
      <button
        onClick={() => onComplete(quest.id)}
        disabled={quest.completed || expired || !ready}
        style={quest.completed ? { animation: "scaleIn 0.25s ease-out" } : undefined}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-[var(--transition)] ${
          quest.completed
            ? "bg-accent border-accent text-white"
            : expired
            ? "border-[#e05252] text-[#e05252]"
            : ready
            ? "border-border hover:border-accent cursor-pointer"
            : "border-border/60 cursor-not-allowed opacity-50"
        }`}
      >
        {quest.completed ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="m5 13 4 4L19 7" />
          </svg>
        ) : expired ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 6 18 18M18 6 6 18" />
          </svg>
        ) : null}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${quest.completed ? "line-through text-dim" : expired ? "text-[#e05252]" : "text-primary"}`}>
          {quest.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
            {badge.icon} {badge.label}
          </span>
          <span className="text-[11px] font-semibold text-dim px-2 py-0.5 rounded-full bg-muted flex items-center gap-1">
            {quest.type === "weekly" ? (<><PiCalendarDuotone className="text-[#EE90F9]" /> Weekly</>) : (<><PiSunDuotone className="text-[#F59E0B]" /> Daily</>)}
          </span>
          {quest.dueDate && (
            <span className="text-[11px] text-dim">Due: {quest.dueDate}</span>
          )}
          {expired && (
            <span className="text-[11px] font-bold text-[#e05252] bg-[rgba(224,82,82,0.15)] px-2 py-0.5 rounded-full">
              Expired
            </span>
          )}
          {waiting && (
            <span className="text-[11px] font-semibold text-dim px-2 py-0.5 rounded-full bg-muted flex items-center gap-1">
              <PiTimerDuotone className="text-[#F59E0B]" /> {formatCountdown(quest.readyAt - now)}
            </span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0 flex flex-col items-end gap-1">
        <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">+{quest.xp} XP</span>
        <span className="text-[11px] font-semibold text-amber-500 bg-[rgba(245,158,11,0.15)] px-2 py-0.5 rounded-full flex items-center justify-end gap-1">
          +{quest.seeds} <PiAcornDuotone className="text-[11px]" />
        </span>
      </div>
    </div>
  );
}
