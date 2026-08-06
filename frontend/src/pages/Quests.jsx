import { useState } from "react";
import { useGame } from "../context/GameStateContext";
import QuestCard from "../components/QuestCard/QuestCard";
import Button from "../components/Button/Button";
import { RiSeedlingLine } from "react-icons/ri";
import { GiSpotedFlower } from "react-icons/gi";
import { TbSeedlingFilled, TbPlant2 } from "react-icons/tb";

const DAILY_CAPS = { seedling: 3, sprout: 4, bloom: 3 };
const WEEKLY_CAPS = { sprout: 6, bloom: 9 };
const DIFF_LABEL = {
  seedling: <><TbSeedlingFilled className="inline text-[#80C779]" /> Seedling</>,
  sprout: <><TbPlant2 className="inline text-[#EE90F9]" /> Sprout</>,
  bloom: <><GiSpotedFlower className="inline text-[#FA8FD1]" /> Bloom</>,
};

export default function Quests() {
  const { quests, completeQuest, addQuest } = useGame();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuest, setNewQuest] = useState({ title: "", difficulty: "seedling", type: "daily", dueDate: "" });

  const countActive = (type, difficulty) =>
    quests.filter((q) => q.type === type && q.difficulty === difficulty && !q.completed).length;

  const dailyCounts = {
    seedling: countActive("daily", "seedling"),
    sprout: countActive("daily", "sprout"),
    bloom: countActive("daily", "bloom"),
  };
  const weeklyCounts = {
    sprout: countActive("weekly", "sprout"),
    bloom: countActive("weekly", "bloom"),
  };

  const dailyFull = dailyCounts.seedling >= DAILY_CAPS.seedling && dailyCounts.sprout >= DAILY_CAPS.sprout && dailyCounts.bloom >= DAILY_CAPS.bloom;
  const weeklyFull = weeklyCounts.sprout >= WEEKLY_CAPS.sprout && weeklyCounts.bloom >= WEEKLY_CAPS.bloom;

  const capsForType = newQuest.type === "weekly" ? WEEKLY_CAPS : DAILY_CAPS;
  const availDifficulties = newQuest.type === "weekly" ? ["sprout", "bloom"] : ["seedling", "sprout", "bloom"];
  const selectedLeft = capsForType[newQuest.difficulty] - countActive(newQuest.type, newQuest.difficulty);
  const selectedTypeFull = newQuest.type === "weekly" ? weeklyFull : dailyFull;
  const submitDisabled = selectedTypeFull || selectedLeft <= 0;

  let filtered = quests.filter((q) => {
    if (filter === "daily") return q.type === "daily";
    if (filter === "weekly") return q.type === "weekly";
    if (filter === "completed") return q.completed;
    if (filter === "active") return !q.completed;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "newest") return b.id.localeCompare(a.id);
    if (sortBy === "oldest") return a.id.localeCompare(b.id);
    if (sortBy === "difficulty") {
      const order = { seedling: 0, sprout: 1, bloom: 2 };
      return order[b.difficulty] - order[a.difficulty];
    }
    return 0;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newQuest.title.trim()) return;
    if (newQuest.type === "weekly" && newQuest.difficulty === "seedling") return;
    if (submitDisabled) return;
    addQuest({ ...newQuest, title: newQuest.title.trim(), dueDate: newQuest.dueDate || null });
    setNewQuest({ title: "", difficulty: "seedling", type: "daily", dueDate: "" });
    setShowAddModal(false);
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-semibold text-primary">Quests</h1>
        <Button variant="primary" onClick={() => setShowAddModal(true)} disabled={dailyFull && weeklyFull} className={dailyFull && weeklyFull ? "opacity-50 cursor-not-allowed" : ""}>+ New Quest</Button>
      </div>

      <div className="bg-surface border border-border/40 rounded-[var(--radius-lg)] p-3.5 mb-4 text-xs font-semibold text-secondary flex flex-col gap-1.5" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-primary font-bold">Daily:</span>
          <span className={dailyCounts.seedling >= DAILY_CAPS.seedling ? "text-dim" : ""}><TbSeedlingFilled className="inline text-[#80C779]" /> {dailyCounts.seedling}/{DAILY_CAPS.seedling}</span>
          <span className={dailyCounts.sprout >= DAILY_CAPS.sprout ? "text-dim" : ""}><TbPlant2 className="inline text-[#EE90F9]" /> {dailyCounts.sprout}/{DAILY_CAPS.sprout}</span>
          <span className={dailyCounts.bloom >= DAILY_CAPS.bloom ? "text-dim" : ""}><GiSpotedFlower className="inline text-[#FA8FD1]" /> {dailyCounts.bloom}/{DAILY_CAPS.bloom}</span>
          <span className="text-[11px] text-dim ml-1">(seedling · sprout · bloom)</span>
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-primary font-bold">Weekly:</span>
          <span className={weeklyCounts.sprout >= WEEKLY_CAPS.sprout ? "text-dim" : ""}><TbPlant2 className="inline text-[#EE90F9]" /> {weeklyCounts.sprout}/{WEEKLY_CAPS.sprout}</span>
          <span className={weeklyCounts.bloom >= WEEKLY_CAPS.bloom ? "text-dim" : ""}><GiSpotedFlower className="inline text-[#FA8FD1]" /> {weeklyCounts.bloom}/{WEEKLY_CAPS.bloom}</span>
          <span className="text-[11px] text-dim ml-1">(sprout · bloom)</span>
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === f.key
                  ? "bg-accent text-white border-accent shadow-[0_2px_8px_rgba(184,164,114,0.3)]"
                  : "bg-transparent text-secondary border-border hover:border-accent hover:text-accent hover:bg-accent/5"
              }`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          className="px-3 py-1.5 rounded-[var(--radius-md)] border border-border bg-surface text-primary text-xs font-semibold focus:border-accent transition-colors cursor-pointer"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="difficulty">Difficulty</option>
        </select>
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-14 text-secondary bg-muted/50 rounded-[var(--radius-lg)] border border-border/50 border-dashed">
            <span className="text-5xl block mb-3">🌸</span>
            <p className="font-semibold">No quests found</p>
            <p className="text-sm text-dim mt-1">Try a different filter or add a new quest</p>
          </div>
        ) : (
          filtered.map((q) => (
            <QuestCard key={q.id} quest={q} onComplete={completeQuest} />
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowAddModal(false)} style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-surface rounded-[var(--radius-xl)] p-8 w-full max-w-md shadow-[var(--shadow-lg)] border border-border/50" onClick={(e) => e.stopPropagation()} style={{ animation: "scaleIn 0.3s ease-out" }}>
            <h2 className="text-2xl font-semibold text-primary mb-6">New Quest</h2>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
                <span>Title</span>
                <input type="text" value={newQuest.title} onChange={(e) => setNewQuest((p) => ({ ...p, title: e.target.value }))} placeholder="What do you need to do?" autoFocus className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent focus:shadow-[0_0_0_3px_rgba(184,164,114,0.1)] transition-all" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-secondary">
                <span>Difficulty</span>
                <select value={newQuest.difficulty} onChange={(e) => setNewQuest((p) => ({ ...p, difficulty: e.target.value }))} className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent transition-colors cursor-pointer">
                  {availDifficulties.map((d) => {
                    const left = capsForType[d] - countActive(newQuest.type, d);
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
                  value={newQuest.type}
                  onChange={(e) =>
                    setNewQuest((p) => ({
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
                <input type="date" value={newQuest.dueDate} onChange={(e) => setNewQuest((p) => ({ ...p, dueDate: e.target.value }))} className="px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-muted text-primary text-sm focus:border-accent transition-colors cursor-pointer" />
              </label>
              <div className="flex justify-end gap-2.5 mt-2">
                <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleAdd} disabled={submitDisabled} className={submitDisabled ? "opacity-50 cursor-not-allowed" : ""}>Plant Quest <RiSeedlingLine className="inline" /></Button>
              </div>
              {submitDisabled && (
                <p className="text-[11px] font-semibold text-dim mt-1">
                  {newQuest.type === "weekly" ? "Weekly" : "Daily"} quests are at their limit — complete an active quest to free a slot.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
