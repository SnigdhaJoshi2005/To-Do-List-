import { useState } from "react";
import { useGame } from "../../context/GameStateContext";
import Button from "../Button/Button";
import { PiAcornDuotone } from "react-icons/pi";

export default function WelcomeModal({ open, onDismiss }) {
  const { claimWelcomeBonus } = useGame();
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleClaim = async () => {
    if (claiming) return;
    setClaiming(true);
    setError("");
    const res = await claimWelcomeBonus();
    if (res.ok) {
      onDismiss();
    } else {
      setError(res.error || "Could not claim welcome bonus");
      setClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm" onClick={onDismiss} style={{ animation: "fadeIn 0.2s ease-out" }}>
      <div className="bg-surface rounded-[var(--radius-xl)] p-8 w-full max-w-md shadow-[var(--shadow-lg)] border border-border/50 text-center" onClick={(e) => e.stopPropagation()} style={{ animation: "scaleIn 0.3s ease-out" }}>
        <span className="text-5xl block mb-4" style={{ animation: "scaleIn 0.4s ease-out" }}>🌱</span>
        <h2 className="text-2xl font-semibold text-primary mb-2">Welcome to Questify!</h2>
        <p className="text-sm text-secondary leading-relaxed">
          Plant quests, grow your garden, and build streaks. Here are{" "}
          <span className="inline-flex items-center gap-1 font-bold text-amber-500">
            50 <PiAcornDuotone />
          </span>{" "}
          seeds to get you started. Claim them and plant your first quest below.
        </p>
        {error && (
          <p className="text-[11px] font-semibold text-[#e05252] bg-[rgba(224,82,82,0.1)] px-3 py-2 rounded-lg mt-4">
            {error}
          </p>
        )}
        <div className="flex justify-center gap-2.5 mt-6">
          <Button variant="primary" onClick={handleClaim} disabled={claiming} className={claiming ? "opacity-60 cursor-not-allowed" : ""}>
            {claiming ? "Claiming..." : "Claim 50 seeds"}
          </Button>
        </div>
      </div>
    </div>
  );
}
