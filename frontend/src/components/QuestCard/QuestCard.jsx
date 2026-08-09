import { useEffect, useState } from "react";
import { RiSeedlingLine, RiAddLine, RiCloseLine, RiCheckboxBlankCircleLine, RiCheckboxCircleLine, RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import { GiSpotedFlower } from "react-icons/gi";
import { TbPlant2 } from "react-icons/tb";
import { PiAcornDuotone, PiSunDuotone, PiCalendarDuotone, PiTimerDuotone } from "react-icons/pi";
import { useGame } from "../../context/GameStateContext";

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
  const { toggleSubtask, addSubtask, deleteSubtask } = useGame();
  const badge = difficultyBadge[quest.difficulty] || difficultyBadge.sprout;
  const [now, setNow] = useState(Date.now());
  const [expanded, setExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  const expired = !quest.completed && quest.expiresDay && todayStr() >= quest.expiresDay;
  const ready = quest.completed || !quest.readyAt || now >= quest.readyAt;
  const waiting = !quest.completed && !expired && !ready;

  const subtasks = quest.subtasks || [];
  const subtaskTotal = subtasks.length;
  const subtaskDone = subtasks.filter((s) => s.done).length;
  const lockedBySubtasks = !quest.completed && subtaskTotal > 0 && subtaskDone < subtaskTotal;
  const completeDisabled = quest.completed || expired || !ready || lockedBySubtasks;
  const locked = quest.completed || expired;

  useEffect(() => {
    if (!waiting) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [waiting]);

  return (
    <div
      style={{ borderLeftColor: badge.bar }}
      className={`bg-surface border border-l-4 rounded-[var(--radius-lg)] p-4 flex flex-col gap-3 transition-all duration-[var(--transition)] ${
        quest.completed
          ? "border-[#80C779]/30 bg-[rgba(128,199,121,0.07)] opacity-80"
          : expired
          ? "border-[#ef7d7d]/40 bg-[rgba(239,125,125,0.06)]"
          : "border-border/50 hover:border-accent/40 hover:shadow-[var(--shadow-md)] hover:-translate-y-1"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
        onClick={() => onComplete(quest.id)}
        disabled={completeDisabled}
        title={lockedBySubtasks ? "Complete all subtasks first" : undefined}
        style={quest.completed ? { animation: "scaleIn 0.25s ease-out" } : undefined}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-[var(--transition)] ${
          quest.completed
            ? "bg-accent border-accent text-white"
            : expired
            ? "border-[#e05252] text-[#e05252]"
            : ready && !lockedBySubtasks
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
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap inline-flex items-center gap-1 ${badge.color}`}>
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
        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-md)] border flex items-center gap-1.5 transition-all cursor-pointer ${
              expanded
                ? "bg-accent border-accent text-white"
                : subtaskDone === subtaskTotal && subtaskTotal > 0
                ? "bg-[rgba(128,199,121,0.15)] text-[#80C779] border-[#80C779]/40 hover:bg-[rgba(128,199,121,0.25)]"
                : "bg-surface border-border text-secondary hover:border-accent hover:text-accent"
            }`}
          >
            {expanded ? <RiArrowDownSLine className="text-sm" /> : <RiArrowRightSLine className="text-sm" />}
            {subtaskTotal > 0 ? `Subtasks (${subtaskDone}/${subtaskTotal})` : "Subtasks"}
          </button>
          {lockedBySubtasks && (
            <span className="text-[11px] font-semibold text-dim px-2 py-0.5 rounded-full bg-muted hidden sm:inline-flex items-center gap-1">
              Complete subtasks to finish
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

      {subtaskTotal > 0 && (
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${subtaskDone === subtaskTotal ? "bg-[#80C779]" : "bg-accent"}`}
            style={{ width: `${Math.round((subtaskDone / subtaskTotal) * 100)}%` }}
          />
        </div>
      )}
      {expanded && (
        <div className="pt-3 border-t border-border/40 flex flex-col gap-1.5" style={{ animation: "fadeIn 0.2s ease-out" }}>
          {subtaskTotal === 0 ? (
            <p className="text-xs text-dim italic">No subtasks yet — add the first step below.</p>
          ) : (
            subtasks.map((s) => (
              <div key={s.id} className="flex items-center gap-2 group">
                <button
                  onClick={() => toggleSubtask(quest.id, s.id)}
                  disabled={locked}
                  className={`shrink-0 transition-all cursor-pointer ${locked ? "opacity-60 cursor-default" : "hover:scale-110"}`}
                  title={s.done ? "Mark as not done" : "Mark as done"}
                >
                  {s.done ? (
                    <RiCheckboxCircleLine className="text-[#80C779] text-lg" />
                  ) : (
                    <RiCheckboxBlankCircleLine className="text-border hover:text-accent text-lg" />
                  )}
                </button>
                <span className={`flex-1 text-[13px] ${s.done ? "line-through text-dim" : "text-secondary"}`}>
                  {s.title}
                </span>
                {!locked && (
                  <button
                    onClick={() => deleteSubtask(quest.id, s.id)}
                    className="text-dim hover:text-[#e05252] transition-colors opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                    title="Delete subtask"
                  >
                    <RiCloseLine className="text-base" />
                  </button>
                )}
              </div>
            ))
          )}
          {locked ? (
            <p className="text-[11px] font-semibold text-dim mt-1">
              This quest is {quest.completed ? "completed" : "expired"} and can't be edited.
            </p>
          ) : (
            <form
              className="flex items-center gap-2 mt-1"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSubtask.trim()) return;
                addSubtask(quest.id, newSubtask.trim()).then((res) => {
                  if (res && res.ok) setNewSubtask("");
                });
              }}
            >
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a step..."
                maxLength={200}
                className="flex-1 px-3 py-1.5 text-xs border border-border rounded-[var(--radius-md)] bg-muted text-primary focus:border-accent transition-colors outline-none"
              />
              <button
                type="submit"
                disabled={!newSubtask.trim()}
                className="text-xs font-semibold text-accent hover:text-white hover:bg-accent border border-accent rounded-[var(--radius-md)] px-2.5 py-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <RiAddLine /> Add
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
