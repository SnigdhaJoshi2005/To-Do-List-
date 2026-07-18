import { useGame } from "../context/GameStateContext";
import VineBar from "../components/VineBar/VineBar";
import { RiSeedlingLine } from "react-icons/ri";
import { FaFire, FaCheck } from "react-icons/fa";

import BL from "../assets/BL.png";
import BS from "../assets/BS.png";
import GL from "../assets/GL.png";
import GS from "../assets/GS.png";
import outfit1Img from "../assets/outfit1.png";
import outfit2Img from "../assets/outfit2.png";
import hair1Img from "../assets/hair1.png";
import hair2Img from "../assets/hair2.png";

const characterImages = {
  "outfit1-hair1": BL,
  "outfit1-hair2": BS,
  "outfit2-hair1": GL,
  "outfit2-hair2": GS,
};

export default function Profile() {
  const { username, level, xp, xpForNextLevel, seeds, streak, totalCompleted, avatar, setAvatar, inventory, logout } = useGame();

  const characterSrc = characterImages[`${avatar.outfit}-${avatar.hair}`] || BL;

  return (
    <div className="py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <h1 className="text-3xl font-semibold text-primary mb-6">Profile</h1>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Column — 35% */}
        <div className="lg:w-[35%] bg-surface border border-border rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] border-2 border-border mb-4">
              <img src={characterSrc} alt="Character" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-[28px] font-semibold text-primary mb-1">{username}</h2>
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-accent to-accent-hover text-white px-3 py-1 rounded-xl text-xs font-bold shadow-[0_2px_6px_rgba(184,164,114,0.25)]">
              <RiSeedlingLine className="inline" /> Lv.{level}
            </span>
          </div>
          <VineBar current={xp} max={xpForNextLevel} label={`${xp}/${xpForNextLevel} XP`} />
        </div>

        {/* Right Column — 65% */}
        <div className="lg:w-[65%] flex flex-col gap-5">
          {/* Customization */}
          <div className="bg-surface border border-border rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-sm)]">
            <h3 className="text-xl font-semibold text-primary mb-5">Customization</h3>
            <div className="flex flex-col gap-5">
              {[
                { label: "Outfit", key: "outfit", options: [{ value: "outfit1", img: outfit1Img }, { value: "outfit2", img: outfit2Img }] },
                { label: "Hair", key: "hair", options: [{ value: "hair1", img: hair1Img }, { value: "hair2", img: hair2Img }] },
              ].map((group) => (
                <div key={group.key} className="flex flex-col gap-2.5">
                  <label className="text-sm font-semibold text-secondary">{group.label}</label>
                  <div className="flex gap-3">
                    {group.options.map((o) => (
                      <button
                        key={o.value}
                        className={`w-28 h-28 rounded-2xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                          avatar[group.key] === o.value ? "border-accent-alt shadow-[0_0_0_3px_rgba(212,165,165,0.2)]" : "border-border"
                        }`}
                        onClick={() => setAvatar((p) => ({ ...p, [group.key]: o.value }))}
                      >
                        <img src={o.img} alt={o.value} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <RiSeedlingLine className="text-2xl" />, value: seeds, label: "Seeds" },
              { icon: <FaFire className="text-2xl" />, value: streak, label: "Day Streak" },
              { icon: <FaCheck className="text-2xl" />, value: totalCompleted, label: "Completed" },
            ].map((s) => (
              <div key={s.label} className="text-center py-4 bg-surface border border-border/40 rounded-[var(--radius-xl)] transition-all duration-200 hover:shadow-[var(--shadow-sm)] hover:-translate-y-px">
                <span className="block mb-1.5 text-accent">{s.icon}</span>
                <span className="block text-xl font-extrabold text-primary tabular-nums">{s.value}</span>
                <span className="text-[11px] text-dim font-semibold uppercase tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Inventory */}
          <div className="bg-surface border border-border rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-sm)]">
            <h3 className="text-xl font-semibold text-primary mb-5">Inventory</h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
              {inventory.filter((i) => i.owned).map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-1.5 py-4 bg-muted/80 rounded-[var(--radius-lg)] border border-border/30 transition-all duration-200 hover:shadow-[var(--shadow-sm)] hover:-translate-y-px">
                  <span className="text-[28px] leading-none">{item.icon}</span>
                  <span className="text-xs font-bold text-primary">{item.name}</span>
                  <span className="text-[11px] text-dim font-semibold">{item.placed ? "🌱 Placed" : "📦 Stored"}</span>
                </div>
              ))}
            </div>
          </div>
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
