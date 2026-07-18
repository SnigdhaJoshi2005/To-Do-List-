import { useState, useEffect, useRef } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./pages/ThemeContext";
import { GameStateProvider, useGame } from "./context/GameStateContext";
import Home from "./pages/Home";
import Quests from "./pages/Quests";
import Calendar from "./pages/Calendar";
import Garden from "./pages/Garden";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";

const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: "home" },
  { to: "/quests", label: "Quests", icon: "check" },
  { to: "/calendar", label: "Calendar", icon: "calendar" },
  { to: "/garden", label: "Garden", icon: "leaf" },
  { to: "/shop", label: "Shop", icon: "bag" },
];

const ICONS = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
    </>
  ),
  check: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 21c0-9 6-15 15-15 0 9-6 15-15 15Z" />
      <path d="M5 21c3-5 6-8 12-11" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l1 13H5L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
};

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-40 p-4 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="glass-card h-full rounded-3xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-semibold text-lg text-primary">
                Questify
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-muted transition-colors text-secondary hover:text-primary cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1.5 flex-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-secondary hover:bg-muted hover:text-primary"
                  }`
                }
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[item.icon]}
                </svg>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

function Layout({ children, homeBg }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 10) {
        setShowHeader(true);
      } else if (y > lastScrollY.current + 5) {
        setShowHeader(false);
      } else if (y < lastScrollY.current - 5) {
        setShowHeader(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative z-10 min-h-screen">

      <div className="relative z-20">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {!homeBg && <header className={`fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-4 transition-transform duration-300 ease-in-out ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors text-secondary hover:text-primary cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              </button>
              <NavLink
                to="/home"
                className="flex items-center gap-2 select-none"
              >
                <span className="text-2xl">🌿</span>
                <span className="font-semibold text-lg tracking-tight text-primary">
                  Questify
                </span>
              </NavLink>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-secondary hover:bg-muted hover:text-primary"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <ThemeToggle variant="default" />

            <NavLink
              to="/profile"
              className="flex items-center gap-2 bg-muted rounded-full pl-1.5 pr-3 py-1.5 hover:bg-accent/10 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-lavender flex items-center justify-center text-xs font-semibold text-white">
                U
              </div>
              <span className="text-sm font-medium text-secondary hidden sm:inline">
                Profile
              </span>
            </NavLink>
          </div>
        </header>}
        <main className={`relative z-10 px-4 sm:px-6 pb-2 max-w-7xl mx-auto ${homeBg ? "" : "pt-20"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <GameStateProvider>
        <AppContent />
      </GameStateProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { authChecked, user } = useGame();
  const location = useLocation();
  const homeBg = location.pathname === "/home";

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-5xl animate-pulse">🌿</span>
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="q-blob q-blob-1" />
        <div className="q-blob q-blob-2" />
        <div className="q-blob q-blob-3" />
      </div>
      <Layout homeBg={homeBg}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/garden" element={<Garden />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </>
  );
}
