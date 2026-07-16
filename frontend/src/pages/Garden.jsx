import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameStateContext";
import Greenhouse from "../components/Greenhouse/Greenhouse";
import Button from "../components/Button/Button";

export default function Garden() {
  const navigate = useNavigate();
  const { inventory, togglePlaced } = useGame();
  const [showInventory, setShowInventory] = useState(false);
  const ownedItems = inventory.filter((i) => i.owned);

  return (
    <div className="py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="flex items-center justify-between mb-5">
        <Button variant="ghost" onClick={() => navigate("/home")}>← Home</Button>
        <h1 className="text-3xl font-semibold text-primary">Your Garden</h1>
        <Button variant="secondary" onClick={() => setShowInventory(!showInventory)}>
          {showInventory ? "Close" : "Inventory"} 🎒
        </Button>
      </div>

      <div className="relative">
        <Greenhouse items={inventory} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-2.5 -left-10 text-4xl opacity-30" style={{ animation: "cloudDrift 25s linear infinite" }}>☁️</div>
          <div className="absolute top-5 -right-7.5 text-3xl opacity-25" style={{ animation: "cloudDrift 30s linear infinite -10s" }}>☁️</div>
          <div className="absolute top-10 left-[40%] text-2xl opacity-20" style={{ animation: "cloudDrift 35s linear infinite -20s" }}>☁️</div>
        </div>
      </div>

      {showInventory && (
        <div className="mt-6 bg-surface border border-border rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-sm)]" style={{ animation: "slideUp 0.3s ease-out" }}>
          <h2 className="text-xl font-semibold text-primary mb-5">Your Items</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3">
            {ownedItems.map((item) => (
              <div
                key={item.id}
                className={`bg-muted border-2 border-border rounded-[var(--radius-lg)] p-4 flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-200 hover:border-accent hover:-translate-y-1 hover:shadow-[var(--shadow-sm)] active:scale-95 ${
                  item.placed ? "border-accent bg-accent/10" : ""
                }`}
                onClick={() => togglePlaced(item.id)}
              >
                <span className="text-[28px] leading-none transition-transform duration-300 hover:scale-110">{item.icon}</span>
                <span className="text-xs font-bold text-primary">{item.name}</span>
                <span className="text-[11px] font-semibold text-dim">{item.placed ? "In garden" : "Stored"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
