import { FaLock } from "react-icons/fa";
import Button from "../Button/Button";

export default function ShopItemCard({ item, onBuy, canAfford }) {
  return (
    <div className="bg-surface border border-border/50 rounded-[var(--radius-lg)] p-5 flex flex-col items-center gap-3 transition-all duration-[var(--transition)] hover:shadow-[var(--shadow-sm)] hover:-translate-y-1">
      <div className="relative h-16 w-16 flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className={`h-16 w-16 object-contain ${item.locked ? "grayscale opacity-50" : ""}`}
          />
        ) : (
          <span className={`text-4xl leading-none ${item.locked ? "grayscale opacity-50" : ""}`}>
            {item.icon}
          </span>
        )}
        {item.locked && (
          <span className="absolute inset-0 flex items-center justify-center">
            <FaLock className="text-2xl text-primary" />
          </span>
        )}
      </div>
      <p className="text-sm font-bold text-primary text-center">{item.name}</p>
      <p className="text-[11px] text-dim text-center leading-tight">{item.description}</p>

      {item.owned ? (
        <span className="text-[11px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
          Owned {item.qty > 1 ? `×${item.qty}` : ""}
        </span>
      ) : item.locked ? (
        <span className="text-[11px] font-bold text-dim px-3 py-1 rounded-full">
          Unlocks at Lv.{item.levelRequired}
        </span>
      ) : (
        <Button
          variant={canAfford ? "primary" : "secondary"}
          size="sm"
          disabled={!canAfford}
          onClick={() => onBuy(item.id)}
          className={!canAfford ? "opacity-50 cursor-not-allowed" : ""}
        >
          🌰 {item.price}
        </Button>
      )}
    </div>
  );
}
