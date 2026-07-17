import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameStateContext";
import { useTheme } from "./ThemeContext";
import dayGreenhouse from "../assets/daygreenhouse.png";
import nightGreenhouse from "../assets/nightgreenhouse.png";

import VineBar from "../components/VineBar/VineBar";
import QuestCard from "../components/QuestCard/QuestCard";
import Button from "../components/Button/Button";

export default function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    quests,
    xp,
    level,
    xpForNextLevel,
    completeQuest,
    addQuest,
    inventory,
  } = useGame();
  const [newQuestTitle, setNewQuestTitle] = useState("");

  const activeQuests = quests.filter((q) => !q.completed);
  const dailyQuests = activeQuests.filter((q) => q.type === "daily");
  const weeklyQuests = activeQuests.filter((q) => q.type === "weekly");

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;
    addQuest({
      title: newQuestTitle.trim(),
      difficulty: "seedling",
      type: "daily",
    });
    setNewQuestTitle("");
  };

  return (
    <div
      className="flex flex-col min-h-[calc(100vh-7rem)] py-4"
      style={{ animation: "fadeIn 0.4s ease-out" }}
    >
      <div className="flex items-center gap-4 mb-20 shrink-0">
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-accent to-accent-hover text-white pl-3.5 pr-4 py-2 rounded-full shrink-0 shadow-[0_2px_8px_rgba(156,175,136,0.3)]">
          <span className="text-lg leading-none">🌱</span>
          <span className="font-bold text-sm">Lv.{level}</span>
        </div>
        <div className="flex-1">
          <VineBar
            current={xp}
            max={xpForNextLevel}
            label={`${xp}/${xpForNextLevel} XP`}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end shrink-0">
        <div className="flex items-center justify-center pt-4 mb-2">
          <img
            src={theme === "dark" ? nightGreenhouse : dayGreenhouse}
            alt="Greenhouse"
            className="w-[768px] h-auto"
          />
        </div>
        <div className="flex items-center justify-center py-6">
          <p
            onClick={() => navigate("/garden")}
            className="text-white font-semibold text-sm cursor-pointer hover:underline text-center"
          >
            Visit your garden →
          </p>
        </div>

        <div className="flex flex-col items-center gap-0.5 py-4 cursor-pointer text-white/80 hover:text-white transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-widest">
            Today's Quests
          </span>
          <span className="text-lg animate-bounce">↓</span>
        </div>

        <div className="pb-10">
          {weeklyQuests.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl text-white mb-3 flex items-center gap-2">
                <span>📅</span> Weekly
              </h2>
              <div className="flex flex-col gap-2.5">
                {weeklyQuests.map((q) => (
                  <QuestCard key={q.id} quest={q} onComplete={completeQuest} />
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl text-white mb-3 flex items-center gap-2">
              <span>☀️</span> Daily
            </h2>
            <div className="flex flex-col gap-2.5">
              {dailyQuests.length === 0 ? (
                <div className="text-center py-10 text-secondary bg-white/10 backdrop-blur-sm rounded-[var(--radius-lg)] border border-white/20 border-dashed">
                  <span className="text-5xl block mb-3">🌻</span>
                  <p className="font-semibold text-white">
                    All quests complete!
                  </p>
                  <p className="text-sm text-white/60 mt-1">
                    Add a new one below
                  </p>
                </div>
              ) : (
                dailyQuests.map((q) => (
                  <QuestCard key={q.id} quest={q} onComplete={completeQuest} />
                ))
              )}
            </div>
          </div>

          <form className="flex gap-2.5 mt-5" onSubmit={handleQuickAdd}>
            <input
              className="flex-1 px-4 py-3 border-2 border-white/20 rounded-[var(--radius-md)] bg-white/10 backdrop-blur-sm text-white text-sm focus:border-accent focus:shadow-[0_0_0_3px_rgba(156,175,136,0.1)] transition-all placeholder:text-white/50"
              type="text"
              placeholder="Add a new quest..."
              value={newQuestTitle}
              onChange={(e) => setNewQuestTitle(e.target.value)}
            />
            <Button variant="primary" size="md" onClick={handleQuickAdd}>
              Plant 🌱
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
