import { useGame } from "../context/GameStateContext";
import VineBar from "../components/VineBar/VineBar";
import { RiSeedlingLine } from "react-icons/ri";
import { FaFire, FaCheck, FaLeaf } from "react-icons/fa";

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
    <div className="relative isolate py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <span className="profile-leaf left-[3%] top-[-10%] text-lg" style={{ animationDuration: "8.2s", animationDelay: "0s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[11%] top-[-6%] text-xl" style={{ animationDuration: "9.6s", animationDelay: "-1.4s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[19%] top-[-14%] text-base" style={{ animationDuration: "7.4s", animationDelay: "-3.1s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[27%] top-[-8%] text-xl" style={{ animationDuration: "10.4s", animationDelay: "-5.2s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[35%] top-[-12%] text-lg" style={{ animationDuration: "8.8s", animationDelay: "-2.6s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[43%] top-[-5%] text-base" style={{ animationDuration: "7.9s", animationDelay: "-4.8s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[51%] top-[-16%] text-xl" style={{ animationDuration: "9.1s", animationDelay: "-0.9s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[59%] top-[-9%] text-lg" style={{ animationDuration: "10.8s", animationDelay: "-6.3s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[67%] top-[-7%] text-base" style={{ animationDuration: "7.6s", animationDelay: "-2.1s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[75%] top-[-13%] text-xl" style={{ animationDuration: "9.9s", animationDelay: "-7.4s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[83%] top-[-11%] text-lg" style={{ animationDuration: "8.5s", animationDelay: "-5.8s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[91%] top-[-6%] text-base" style={{ animationDuration: "7.2s", animationDelay: "-3.9s" }}><FaLeaf /></span>
        <span className="profile-leaf left-[96%] top-[-15%] text-lg" style={{ animationDuration: "10.1s", animationDelay: "-8.6s" }}><FaLeaf /></span>
      </div>

      <h1 className="text-3xl font-semibold text-primary mb-6">Profile</h1>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Column — 35% */}
        <div className="lg:w-[35%] storybook-card p-7 flex flex-col">
          <span className="sb-sparkle sb-s1">✦</span>
          <span className="sb-sparkle sb-s2">✦</span>
          <div className="flex flex-col items-center mb-6 flex-1">
            <div className="w-full flex-1 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] mb-4">
              <img src={characterSrc} alt="Character" className="w-full h-full object-contain" />
              
            </div>
            <h2 className="text-[28px] font-semibold text-primary mb-1">{username}</h2>
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-accent to-accent-hover text-white px-3 py-1 rounded-xl text-xs font-bold shadow-[0_2px_6px_rgba(184,164,114,0.25)]">
              <RiSeedlingLine className="inline" /> Lv.{level}
            </span>
          </div>
          <VineBar current={xp} max={xpForNextLevel} label={`${xp}/${xpForNextLevel} XP`} />
          <p className="text-xs text-dim mt-2">{xpForNextLevel - xp} XP needed for next level</p>
          {streak > 0 && <p className="text-xs text-dim mt-0.5">🔥 on a {streak}-day streak!</p>}
        </div>

        {/* Right Column — 65% */}
        <div className="lg:w-[65%] flex flex-col gap-5">
          {/* Customization */}
          <div className="storybook-card p-7">
            <span className="sb-sparkle sb-s1">✦</span>
            <span className="sb-sparkle sb-s2">✦</span>
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
              { icon: <RiSeedlingLine className="text-2xl" />, value: seeds, label: "Seeds", bg: "bg-[rgba(127,160,107,0.15)]", color: "text-sage" },
              { icon: <FaFire className="text-2xl" />, value: streak, label: "Day Streak", bg: "bg-[rgba(226,149,120,0.15)]", color: "text-coral" },
              { icon: <FaCheck className="text-2xl" />, value: totalCompleted, label: "Completed", bg: "bg-[rgba(195,169,238,0.15)]", color: "text-lavender" },
            ].map((s) => (
              <div key={s.label} className="storybook-card text-center py-7">
                <span className="sb-sparkle sb-s1">✦</span>
                <span className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl ${s.bg} ${s.color}`}>{s.icon}</span>
                <span className="block text-2xl font-extrabold text-primary tabular-nums">{s.value}</span>
                <span className="text-[11px] text-dim font-semibold uppercase tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Inventory */}
          <div className="storybook-card p-7">
            <span className="sb-sparkle sb-s1">✦</span>
            <span className="sb-sparkle sb-s2">✦</span>
            <h3 className="text-xl font-semibold text-primary mb-5">Inventory</h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
              {inventory.filter((i) => i.owned).map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-1.5 py-4 bg-muted/80 rounded-[var(--radius-lg)] border border-border/30 transition-all duration-200 hover:shadow-[var(--shadow-sm)] hover:-translate-y-px">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-9 w-9 object-contain" />
                  ) : (
                    <span className="text-[28px] leading-none">{item.icon}</span>
                  )}
                  <span className="text-xs font-bold text-primary">{item.name}</span>
                  <span className="text-[11px] text-dim font-semibold">{item.placed ? (<><RiSeedlingLine className="inline-block" /> Placed</>) : "📦 Stored"}</span>
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
