import { useEffect, useState } from "react";
import { useGame } from "../context/GameStateContext";
import QuestCard from "../components/QuestCard/QuestCard";
import Button from "../components/Button/Button";
import NewQuestModal from "../components/NewQuestModal/NewQuestModal";
import { DAILY_CAPS, WEEKLY_CAPS } from "../constants/quests";
import { GiSpotedFlower } from "react-icons/gi";
import { TbSeedlingFilled, TbPlant2 } from "react-icons/tb";

const todayStr = (d = new Date()) => {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const capRow = (label, count, cap, hex, icon, full) => (
  <div>
    <div className={`flex items-center justify-between gap-2 ${full ? "text-dim" : ""}`}>
      <span className="flex items-center gap-1">{icon} {label}</span>
      <span>{count}/{cap}</span>
    </div>
    <div className="h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (count / cap) * 100)}%`, background: hex }} />
    </div>
  </div>
);

export default function Quests() {
  const { quests, completeQuest } = useGame();
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showAddModal, setShowAddModal] = useState(false);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const today = todayStr(new Date(now));
  const isExpired = (q) => !q.completed && q.expiresDay && today >= q.expiresDay;

  const countActive = (type, difficulty) =>
    quests.filter((q) => q.type === type && q.difficulty === difficulty && !q.completed && !isExpired(q)).length;

  const countUsedToday = (difficulty) =>
    quests.filter((q) => q.type === "daily" && q.difficulty === difficulty && q.plantedDay === today).length;

  const dailyCounts = {
    seedling: countUsedToday("seedling"),
    sprout: countUsedToday("sprout"),
    bloom: countUsedToday("bloom"),
  };
  const weeklyCounts = {
    sprout: countActive("weekly", "sprout"),
    bloom: countActive("weekly", "bloom"),
  };

  const dailyFull = dailyCounts.seedling >= DAILY_CAPS.seedling && dailyCounts.sprout >= DAILY_CAPS.sprout && dailyCounts.bloom >= DAILY_CAPS.bloom;
  const weeklyFull = weeklyCounts.sprout >= WEEKLY_CAPS.sprout && weeklyCounts.bloom >= WEEKLY_CAPS.bloom;

  let filtered = quests.filter((q) => {
    if (filter === "daily") return q.type === "daily";
    if (filter === "weekly") return q.type === "weekly";
    if (filter === "completed") return q.completed;
    if (filter === "incomplete") return isExpired(q);
    if (filter === "active") return !q.completed && !isExpired(q);
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

  const filters = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "incomplete", label: "Incomplete" },
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

      <div className="bg-gradient-to-r from-[rgba(128,199,121,0.12)] via-surface to-[rgba(250,143,209,0.12)] border border-border/40 rounded-[var(--radius-lg)] p-4 mb-4 text-xs font-semibold text-secondary grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <div className="flex flex-col gap-3">
          <p className="text-primary font-bold">Daily</p>
          {capRow("Seedling", dailyCounts.seedling, DAILY_CAPS.seedling, "#80C779", <TbSeedlingFilled className="inline text-[#80C779]" />, dailyCounts.seedling >= DAILY_CAPS.seedling)}
          {capRow("Sprout", dailyCounts.sprout, DAILY_CAPS.sprout, "#EE90F9", <TbPlant2 className="inline text-[#EE90F9]" />, dailyCounts.sprout >= DAILY_CAPS.sprout)}
          {capRow("Bloom", dailyCounts.bloom, DAILY_CAPS.bloom, "#FA8FD1", <GiSpotedFlower className="inline text-[#FA8FD1]" />, dailyCounts.bloom >= DAILY_CAPS.bloom)}
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-primary font-bold">Weekly</p>
          {capRow("Sprout", weeklyCounts.sprout, WEEKLY_CAPS.sprout, "#EE90F9", <TbPlant2 className="inline text-[#EE90F9]" />, weeklyCounts.sprout >= WEEKLY_CAPS.sprout)}
          {capRow("Bloom", weeklyCounts.bloom, WEEKLY_CAPS.bloom, "#FA8FD1", <GiSpotedFlower className="inline text-[#FA8FD1]" />, weeklyCounts.bloom >= WEEKLY_CAPS.bloom)}
        </div>
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
          filtered.map((q, idx) => (
            <div key={q.id} style={{ animation: "fadeIn 0.4s ease-out forwards", animationDelay: `${Math.min(idx, 10) * 0.05}s` }}>
              <QuestCard quest={q} onComplete={completeQuest} />
            </div>
          ))
        )}
      </div>

      <NewQuestModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
