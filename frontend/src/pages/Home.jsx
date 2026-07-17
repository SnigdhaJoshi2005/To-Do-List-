import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameStateContext";
import { useTheme } from "./ThemeContext";
import day1 from "../assets/day1.jpg";
import night1 from "../assets/night1.jpg";
import bushDay from "../assets/bushday.png";
import bushNight from "../assets/bushnight.png";

import VineBar from "../components/VineBar/VineBar";
import QuestCard from "../components/QuestCard/QuestCard";
import Button from "../components/Button/Button";

const NAV_ITEMS = [
  { to: "/home", label: "Home" },
  { to: "/quests", label: "Quests" },
  { to: "/calendar", label: "Calendar" },
  { to: "/garden", label: "Garden" },
  { to: "/shop", label: "Shop" },
];

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      {/* Hero Section */}
      <div
        className="relative h-screen -mt-2 bg-cover bg-center bg-no-repeat flex flex-col"
        style={{
          backgroundImage: `url(${theme === "dark" ? night1 : day1})`,
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          maxWidth: "none",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />

        {/* Hero Header */}
        <div className="relative z-20 px-4 sm:px-6 pt-4">
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              </button>
              <NavLink
                to="/home"
                className="flex items-center gap-2 select-none"
              >
                <span className="text-2xl">🌿</span>
                <span className="font-semibold text-lg tracking-tight text-white">
                  Questify
                </span>
              </NavLink>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer text-lg"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <NavLink
              to="/profile"
              className="flex items-center gap-2 bg-white/20 rounded-full pl-1.5 pr-3 py-1.5 hover:bg-white/30 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-lavender flex items-center justify-center text-xs font-semibold text-white">
                U
              </div>
              <span className="text-sm font-medium text-white hidden sm:inline">
                Profile
              </span>
            </NavLink>
          </div>
        </div>

        {/* Level / XP Bar */}
        <div className="relative z-20 px-6 sm:px-8 pt-4 pb-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-accent to-accent-hover text-white pl-3.5 pr-4 py-2 rounded-full shrink-0 shadow-[0_2px_8px_rgba(156,175,136,0.3)]">
              <span className="text-lg leading-none">🌱</span>
              <span className="font-bold text-sm">Lv.{level}</span>
            </div>
            <div className="flex-1">
              <VineBar current={xp} max={xpForNextLevel} />
            </div>
          </div>
          <p className="text-xs text-white/70 font-semibold mt-1.5 text-right">
            {xp}/{xpForNextLevel} XP
          </p>
        </div>

        {/* Hero Sidebar */}
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <aside
            className={`fixed top-0 left-0 h-screen w-64 z-40 p-4 transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="glass-card h-full rounded-3xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-8 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌿</span>
                  <span className="font-semibold text-lg text-primary">
                    Questify
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted transition-colors text-secondary hover:text-primary cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col gap-1.5 flex-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-secondary hover:bg-muted hover:text-primary"
                      }`
                    }
                  >
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>
        </>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-end gap-6 pb-32">
          <p
            onClick={() => navigate("/garden")}
            className="text-white font-semibold text-sm cursor-pointer hover:underline text-center drop-shadow-md"
          >
            Visit your garden →
          </p>
        </div>

        {/* Bush Divider */}
        <div
          className="absolute -bottom-58 left-0 right-0 z-10"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            maxWidth: "none",
          }}
        >
          <img
            src={theme === "dark" ? bushNight : bushDay}
            alt="Bush divider"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Quests Section */}
      <div className="py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
        <div className="flex flex-col items-center gap-0.5 py-4 cursor-pointer text-secondary hover:text-primary transition-colors">
          <span className="text-[11px] font-semibold uppercase tracking-widest">
            Today's Quests
          </span>
          <span className="text-lg animate-bounce">↓</span>
        </div>

        <div className="pb-10">
          {weeklyQuests.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl text-primary mb-3 flex items-center gap-2">
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
            <h2 className="text-xl text-primary mb-3 flex items-center gap-2">
              <span>☀️</span> Daily
            </h2>
            <div className="flex flex-col gap-2.5">
              {dailyQuests.length === 0 ? (
                <div className="text-center py-10 bg-surface rounded-[var(--radius-lg)] border border-border border-dashed">
                  <span className="text-5xl block mb-3">🌻</span>
                  <p className="font-semibold text-primary">
                    All quests complete!
                  </p>
                  <p className="text-sm text-secondary mt-1">
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
              className="flex-1 px-4 py-3 border-2 border-border rounded-[var(--radius-md)] bg-surface text-primary text-sm focus:border-accent focus:shadow-[0_0_0_3px_rgba(156,175,136,0.1)] transition-all placeholder:text-secondary"
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
