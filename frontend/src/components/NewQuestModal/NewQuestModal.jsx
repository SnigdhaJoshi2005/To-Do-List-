import { useEffect, useState } from "react";
import { useGame } from "../../context/GameStateContext";
import Button from "../Button/Button";
import { RiSeedlingLine } from "react-icons/ri";
import { DAILY_CAPS, WEEKLY_CAPS, DIFF_LABEL } from "../../constants/quests";

const todayStr = (d = new Date()) => {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export default function NewQuestModal({ open, onClose, initialTitle = "" }) {
  const { quests, addQuest } = useGame();
  const [form, setForm] = useState({ title: "", difficulty: "seedling", type: "daily", dueDate: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ title: initialTitle || "", difficulty: "seedling", type: "daily", dueDate: "" });
      setError("");
    }
  }, [open, initialTitle]);

  if (!open) return null;

  const today = todayStr();
  const isExpired = (q) => !q.completed && q.expiresDay && today >= q.expiresDay;

  const countUsedToday = (difficulty) =>
    quests.filter((q) => q.type === "daily" && q.difficulty === difficulty && q.plantedDay === today).length;

  const countActive = (type, difficulty) =>
    quests.filter((q) => q.type === type && q.difficulty === difficulty && !q.completed && !isExpired(q)).length;

  const capsForType = form.type === "weekly" ? WEEKLY_CAPS : DAILY_CAPS;
  const availDifficulties = form.type === "weekly" ? ["sprout", "bloom"] : ["seedling", "sprout", "bloom"];
  const usedForType = form.type === "weekly" ? countActive : countUsedToday;
  const selectedLeft = capsForType[form.difficulty] - usedForType(form.difficulty);

  const dailyFull =
    countUsedToday("seedling") >= DAILY_CAPS.seedling &&
    countUsedToday("sprout") >= DAILY_CAPS.sprout &&
    countUsedToday("bloom") >= DAILY_CAPS.bloom;
  const weeklyFull =
    countActive("weekly", "sprout") >= WEEKLY_CAPS.sprout &&
    countActive("weekly", "bloom") >= WEEKLY_CAPS.bloom;
  const selectedTypeFull = form.type === "weekly" ? weeklyFull : dailyFull;
  const submitDisabled = selectedTypeFull || selectedLeft <= 0 || !form.title.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitDisabled) return;
    const res = await addQuest({ ...form, title: form.title.trim(), dueDate: form.dueDate || null });
    if (res.ok) {
      onClose();
    } else {
      setError(res.error || "Could not create quest");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onClose} style={{ animation: "fadeIn 0.2s ease-out" }}>
      <div className="bg-surface rounded-[var(--radius-xl)] p-8 w-full max-w-md shadow-[var(--shadow-lg)] border border-border/50" onClick={(e) => e.stopPropagation()} style={{ animation: "scaleIn 0.3s ease-out" }}>
        <h2 className="text-2xl font-semibold text-primary mb-6">New Quest</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
            <span>Title</span>
            <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="What do you need to do?" autoFocus className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent focus:shadow-[0_0_0_3px_rgba(184,164,114,0.1)] transition-all" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
            <span>Difficulty</span>
            <select value={form.difficulty} onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value }))} className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent transition-colors cursor-pointer">
              {availDifficulties.map((d) => {
                const left = capsForType[d] - usedForType(d);
                return (
                  <option key={d} value={d} disabled={left <= 0}>
                    {DIFF_LABEL[d]} ({Math.max(left, 0)} left)
                  </option>
                );
              })}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
            <span>Type</span>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  type: e.target.value,
                  difficulty: e.target.value === "weekly" && p.difficulty === "seedling" ? "sprout" : p.difficulty,
                }))
              }
              className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent transition-colors cursor-pointer"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
            <span>Due date (optional)</span>
            <input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent transition-colors cursor-pointer" />
          </label>
          {error && (
            <p className="text-[11px] font-semibold text-[#e05252] bg-[rgba(224,82,82,0.1)] px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2.5 mt-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={submitDisabled} className={submitDisabled ? "opacity-50 cursor-not-allowed" : ""}>Plant Quest <RiSeedlingLine className="inline" /></Button>
          </div>
          {submitDisabled && (
            <p className="text-[11px] font-semibold text-dim mt-1">
              {form.type === "weekly"
                ? "Weekly quests are at their limit — complete an active quest to free a slot."
                : "Daily quests are at their limit for today — new slots unlock at midnight."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
