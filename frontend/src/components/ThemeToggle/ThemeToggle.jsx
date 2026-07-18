import { useTheme } from "../../pages/ThemeContext";
import { IoSunnyOutline } from "react-icons/io5";
import { CiCloudMoon } from "react-icons/ci";

const variantStyles = {
  default: {
    track: "bg-muted border-border shadow-[0_2px_10px_rgba(0,0,0,0.12)]",
    knob: "bg-accent shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
    sun: "text-accent-alt",
    moon: "text-lavender",
  },
  light: {
    track: "bg-white/15 border-white/25 shadow-[0_2px_10px_rgba(0,0,0,0.2)]",
    knob: "bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25)]",
    sun: "text-accent-alt",
    moon: "text-lavender",
  },
};

export default function ThemeToggle({ variant = "default" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const s = variantStyles[variant];

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative inline-flex items-center w-[88px] h-10 rounded-[20px] border transition-all duration-300 cursor-pointer shrink-0 ${s.track}`}
    >
      <span className="absolute inset-[4px] rounded-[16px] bg-surface/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]" />

      <span className="absolute left-[14px] top-1/2 -translate-y-1/2 z-10">
        <IoSunnyOutline className={`w-5 h-5 transition-colors duration-300 ${s.sun}`} />
      </span>
      <span className="absolute right-[14px] top-1/2 -translate-y-1/2 z-10">
        <CiCloudMoon className={`w-5 h-5 transition-colors duration-300 ${s.moon}`} />
      </span>

      <span
        className={`relative z-20 w-8 h-8 rounded-[16px] transition-transform duration-300 ease-in-out ${s.knob} ${
          isDark ? "translate-x-[48px]" : "translate-x-[4px]"
        }`}
      />
    </button>
  );
}
