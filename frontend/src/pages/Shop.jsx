import { useState } from "react";
import { useGame } from "../../context/GameStateContext";
import ShopItemCard from "../../components/ShopItemCard/ShopItemCard";

const categories = ["all", "pets", "plants", "decor", "expansions"];

export default function Shop() {
  const { inventory, seeds, buyItem, canAfford } = useGame();
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = inventory.filter((item) => {
    if (activeCategory === "all") return true;
    return item.type === activeCategory;
  });

  return (
    <div className="py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-[var(--font-display)] text-3xl text-primary">
          Shop
        </h1>
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-accent to-accent-hover text-white pl-3.5 pr-4 py-2 rounded-full font-bold text-base shadow-[0_2px_8px_rgba(156,175,136,0.3)]">
          <span className="text-lg leading-none">🌰</span>
          <span>{seeds}</span>
        </div>
      </div>

      <div className="flex gap-1.5 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-[var(--transition)] ${
              activeCategory === cat
                ? "bg-accent-alt text-white border-accent-alt shadow-[0_2px_8px_rgba(212,165,165,0.3)]"
                : "bg-surface text-secondary border-border hover:border-accent-alt hover:text-accent-alt hover:bg-accent-alt/5"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-4">
        {filtered.map((item) => (
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
