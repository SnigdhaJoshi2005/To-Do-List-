import { createContext, useContext, useState, useEffect, useCallback } from "react";

const API = "http://localhost:5000/api";

const DIFFICULTY_XP = { seedling: 10, sprout: 20, bloom: 35 };
const DIFFICULTY_SEEDS = { seedling: 5, sprout: 10, bloom: 20 };
const PRIORITY_TO_DIFFICULTY = { low: "seedling", medium: "sprout", high: "bloom" };
const DIFFICULTY_TO_PRIORITY = { seedling: "low", sprout: "medium", bloom: "high" };

const GameStateContext = createContext(null);

function mapTaskToQuest(task) {
  const difficulty = PRIORITY_TO_DIFFICULTY[task.priority] || "sprout";
  return {
    id: task._id,
    title: task.title,
    notes: task.notes || "",
    difficulty,
    type: task.type || "daily",
    xp: DIFFICULTY_XP[difficulty],
    seeds: DIFFICULTY_SEEDS[difficulty],
    completed: task.done,
    dueDate: task.due || null,
    createdAt: task.createdAt,
  };
}

export function GameStateProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [quests, setQuests] = useState([]);
  const [stats, setStats] = useState({ xp: 0, level: 1, coins: 50, streak: 0, xpIntoLevel: 0, xpForNextLevel: 100, totalCompleted: 0 });
  const [shopItems, setShopItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [events, setEvents] = useState([]);
  const [avatar, setAvatar] = useState({ outfit: "default", hair: "default", accessory: "none" });

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch(`${API}/auth/me`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {}
  }, []);

  const fetchQuests = useCallback(async () => {
    try {
      const res = await fetch(`${API}/tasks`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setQuests(data.tasks.map(mapTaskToQuest));
      }
    } catch {}
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/tasks/stats`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {}
  }, []);

  const fetchShopItems = useCallback(async () => {
    try {
      const res = await fetch(`${API}/shop/items`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setShopItems(data.items);
      }
    } catch {}
  }, []);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/shop/inventory`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory.items || []);
      }
    } catch {}
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API}/events`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
      }
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          await Promise.all([fetchQuests(), fetchStats(), fetchShopItems(), fetchInventory(), fetchEvents()]);
        }
      } catch {}
      setAuthChecked(true);
    })();
  }, []);

  const addQuest = useCallback(async ({ title, difficulty = "sprout", type = "daily", dueDate = null }) => {
    try {
      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          priority: DIFFICULTY_TO_PRIORITY[difficulty],
          type,
          due: dueDate || "",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuests((prev) => [mapTaskToQuest(data.task), ...prev]);
      }
    } catch {}
  }, []);

  const completeQuest = useCallback(async (questId) => {
    const res = await fetch(`${API}/tasks/${questId}/toggle`, {
      method: "PATCH",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, completed: data.task.done } : q))
      );
      setStats((prev) => ({
        ...prev,
        xp: data.stats.xp,
        level: data.stats.level,
        coins: data.stats.coins,
      }));
    }
  }, []);

  const buyItem = useCallback(async (itemId) => {
    const res = await fetch(`${API}/shop/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ itemId }),
    });
    if (res.ok) {
      const data = await res.json();
      setInventory(data.inventory.items);
      setStats((prev) => ({ ...prev, coins: data.coins }));
    }
  }, []);

  const canAfford = useCallback((price) => {
    return stats.coins >= price;
  }, [stats.coins]);

  const togglePlaced = useCallback((itemId) => {
    setInventory((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, placed: !i.placed } : i))
    );
  }, []);

  const addEvent = useCallback(async ({ title, date, time = "", color = "mint" }) => {
    const res = await fetch(`${API}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, date, time, color }),
    });
    if (res.ok) {
      const data = await res.json();
      setEvents((prev) => [...prev, data.event]);
    }
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    const res = await fetch(`${API}/events/${eventId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setUser(data.user);
    await Promise.all([fetchQuests(), fetchStats(), fetchShopItems(), fetchInventory(), fetchEvents()]);
  }, [fetchQuests, fetchStats, fetchShopItems, fetchInventory, fetchEvents]);

  const register = useCallback(async (username, email, password) => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setQuests([]);
    setStats({ xp: 0, level: 1, coins: 50, streak: 0, xpIntoLevel: 0, xpForNextLevel: 100, totalCompleted: 0 });
    setShopItems([]);
    setInventory([]);
    setEvents([]);
  }, []);

  const mappedInventory = shopItems.map((item) => {
    const owned = inventory.find((i) => i.itemId === item.itemId);
    return {
      id: item.itemId,
      name: item.name,
      icon: item.emoji,
      description: item.description,
      price: item.price,
      type: item.category,
      owned: !!owned,
      qty: owned ? owned.qty : 0,
      placed: false,
    };
  });

  const value = {
    username: user?.username || "User",
    user,
    authChecked,
    quests,
    xp: stats.xpIntoLevel || 0,
    level: stats.level,
    xpForNextLevel: stats.xpForNextLevel || 100,
    seeds: stats.coins,
    streak: stats.streak,
    totalCompleted: stats.totalCompleted,
    inventory: mappedInventory,
    events,
    avatar,
    setAvatar,
    login,
    register,
    logout,
    addQuest,
    completeQuest,
    buyItem,
    canAfford,
    togglePlaced,
    addEvent,
    deleteEvent,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameStateContext);
  if (!ctx) throw new Error("useGame must be used within GameStateProvider");
  return ctx;
}
