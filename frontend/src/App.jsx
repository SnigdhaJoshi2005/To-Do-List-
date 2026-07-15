import { Routes, Route, NavLink } from "react-router-dom";
import { ThemeProvider } from "./pages/ThemeContext";
import { GameStateProvider, useGame } from "./context/GameStateContext";
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import Calendar from "./pages/Calendar";
import Garden from "./pages/Garden";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "home" },
  { to: "/quests", label: "Quests", icon: "check" },
  { to: "/calendar", label: "Calendar", icon: "calendar" },
  { to: "/garden", label: "Garden", icon: "leaf" },
  { to: "/shop", label: "Shop", icon: "bag" },
  { to: "/profile", label: "Profile", icon: "user" },
];

const ICONS = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h5v-6h4v6h5V9.5" /></>,
  check: <><rect x="3" y="4" width="18" height="17" rx="3" /><path d="m8 12 3 3 5-6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
  leaf: <><path d="M5 21c0-9 6-15 15-15 0 9-6 15-15 15Z" /><path d="M5 21c3-5 6-8 12-11" /></>,
  bag: <><path d="M6 8h12l1 13H5L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></>,
};

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:sticky top-0 lg:top-4 left-0 h-screen lg:h-[calc(100vh-2rem)] w-64 z-40 p-4 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="glass-card h-full rounded-3xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-8 px-1">
            <span className="text-2xl">🌿</span>
            <span className="font-semibold text-lg text-primary">Questify</span>
          </div>
          <nav className="flex flex-col gap-1.5 flex-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-secondary hover:bg-muted hover:text-primary"
                  }`
                }
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[item.icon]}</svg>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

function Layout({ children }) {
  return (
    <div className="relative z-10 lg:flex">
      <Sidebar open={false} onClose={() => {}} />
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 px-4 sm:px-6 pt-4">
          <div className="glass-card flex items-center justify-between gap-4 px-5 py-3 rounded-3xl">
            <div className="flex items-center gap-2 select-none">
              <span className="text-2xl">🌿</span>
              <span className="font-semibold text-lg tracking-tight text-primary">Questify</span>
            </div>
            <NavLink to="/profile" className="flex items-center gap-2 bg-muted rounded-full pl-1.5 pr-3 py-1.5 hover:bg-accent/10 transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-lavender flex items-center justify-center text-xs font-semibold text-white">U</div>
              <span className="text-sm font-medium text-secondary">Profile</span>
            </NavLink>
          </div>
        </header>
        <main className="px-4 sm:px-6 py-2 max-w-5xl mx-auto">
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
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
