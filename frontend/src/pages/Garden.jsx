import { FaLock } from "react-icons/fa";
import { PiAcornDuotone } from "react-icons/pi";
import { useGame } from "../context/GameStateContext";
import { useTheme } from "./ThemeContext";
import daygarden from "../assets/daygarden.png";
import nightgarden from "../assets/nightgarden.png";

const POSITIONS = {
  snake_plant: { bottom: "43%", left: "55%", width: "25%" },
  monstera: { bottom: "43%", left: "87%", width: "30%" },
  pilea: { bottom: "8%", left: "57%", width: "19%" },
  coleus: { bottom: "43%", left: "70%", width: "22%" },
  dieffenbachia: { bottom: "43%", left: "10%", width: "28%" },
  peace_lily: { bottom: "8%", left: "25%", width: "25%" },
  pear_cactus: { bottom: "43%", left: "30%", width: "20%" },
  begonia: { bottom: "8%", left: "10%", width: "20%" },
  zebra_haworthia: { bottom: "43%", left: "20%", width: "15%" },
  string_of_dolphins: { bottom: "43%", left: "43%", width: "20%" },
  rosemary: { bottom: "8%", left: "72%", width: "20%" },
  christmas_cactus: { bottom: "8%", left: "87%", width: "25%" },
  caladium: { bottom: "8%", left: "40%", width: "24%" },
};

export default function Garden() {
  const { theme } = useTheme();
  const { inventory, seeds, togglePlaced } = useGame();
  const ownedItems = inventory.filter((i) => i.owned);
  const scenePlants = inventory.filter(
    (i) => i.image && (i.placed || !i.owned),
  );

  return (
    <div className="py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div
        className="relative rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)]"
        style={{
          aspectRatio: "16/9",
          backgroundImage: `url(${theme === "dark" ? nightgarden : daygarden})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="absolute top-4 left-5 text-3xl font-semibold text-white drop-shadow-md">
          Your Garden
        </h1>

        <span className="absolute top-4 right-5 inline-flex items-center gap-1 bg-black/25 backdrop-blur-sm text-white pl-3 pr-3.5 py-1.5 rounded-full text-sm font-bold">
          <PiAcornDuotone className="text-sm" /> {seeds}
        </span>

        {scenePlants.map((item) => {
          const pos = POSITIONS[item.id] || {
            bottom: "8%",
            left: "50%",
            width: "20%",
          };
          const locked = !item.owned;
          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 pointer-events-none select-none"
              style={{
                bottom: pos.bottom,
                left: pos.left,
                width: pos.width,
                animation: "fadeIn 0.5s ease-out",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                title={
                  locked ? `Unlocks at Lv.${item.levelRequired}` : undefined
                }
                className={`w-full ${locked ? "grayscale opacity-50" : ""}`}
              />
              {locked && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <FaLock className="text-4xl text-primary drop-shadow-md" />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="mt-6 bg-surface border border-border rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-sm)]"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
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
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-9 w-9 object-contain transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <span className="text-[28px] leading-none transition-transform duration-300 hover:scale-110">
                  {item.icon}
                </span>
              )}
              <span className="text-xs font-bold text-primary">
                {item.name}
              </span>
              <span className="text-[11px] font-semibold text-dim">
                {item.placed ? "In garden" : "Stored"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
