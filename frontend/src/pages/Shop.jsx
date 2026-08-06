import { useGame } from "../context/GameStateContext";
import ShopItemCard from "../components/ShopItemCard/ShopItemCard";

export default function Shop() {
  const { inventory, level, seeds, buyItem, canAfford } = useGame();

  return (
    <div className="py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-semibold text-primary">Shop</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-accent/10 text-accent px-3 py-1.5 rounded-full">
            Lv.{level}
          </span>
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-accent to-accent-hover text-white pl-3 pr-3.5 py-1.5 rounded-full font-bold text-sm shadow-[0_2px_8px_rgba(184,164,114,0.3)]">
            🌰 {seeds}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-4">
        {inventory.map((item) => (
          <ShopItemCard
            key={item.id}
            item={item}
            onBuy={buyItem}
            canAfford={canAfford(item.price)}
          />
        ))}
      </div>
    </div>
  );
}
