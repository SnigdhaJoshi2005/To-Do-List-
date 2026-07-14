import Button from "../Button/Button";

export default function ShopItemCard({ item, onBuy, canAfford }) {
  return (
    <div className="bg-surface border border-border/50 rounded-[var(--radius-lg)] p-5 flex flex-col items-center gap-3 transition-all duration-[var(--transition)] hover:shadow-[var(--shadow-sm)] hover:-translate-y-1">
      <span className="text-4xl leading-none">{item.icon}</span>
      <p className="text-sm font-bold text-primary text-center">{item.name}</p>
      <p className="text-[11px] text-dim text-center leading-tight">{item.description}</p>

      {item.owned ? (
        <span className="text-[11px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
          Owned ({item.qty})
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
