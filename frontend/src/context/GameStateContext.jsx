import { createContext, useContext, useState, useEffect, useCallback } from "react";
import pilea from "../assets/pilea.png";
import snakeplant from "../assets/snakeplant.png";
import coleus from "../assets/coleus.png";
import dieffenbachia from "../assets/dieffenbachia.png";
import peacelily from "../assets/peacelily.png";
import pearcactus from "../assets/pearcactus.png";
import begonia from "../assets/begonia.png";
import zebrahaworthia from "../assets/zebrahaworthia.png";
import stringsofdolphins from "../assets/stringsofdolphins.png";
import rosemary from "../assets/rosemary.png";
import christmascactus from "../assets/christmascactus.png";
import caladium from "../assets/caladium.png";
import monstera from "../assets/monstera.png";

const API = "http://localhost:5000/api";

const PLANT_IMAGES = {
  pilea,
  snakeplant,
  coleus,
  dieffenbachia,
  peacelily,
  pearcactus,
  begonia,
  zebrahaworthia,
  stringsofdolphins,
  rosemary,
  christmascactus,
  caladium,
  monstera,
};

const DIFFICULTY_XP = { seedling: 10, sprout: 20, bloom: 35 };
const QUEST_SEEDS = {
  daily: { seedling: 1, sprout: 5, bloom: 9 },
  weekly: { sprout: 7, bloom: 12 },
};
const COOLDOWN_MS = { seedling: 5 * 60 * 1000, sprout: 30 * 60 * 1000, bloom: 60 * 60 * 1000 };
const DAILY_STREAK_GOAL = 5;
const PRIORITY_TO_DIFFICULTY = { low: "seedling", medium: "sprout", high: "bloom" };
const DIFFICULTY_TO_PRIORITY = { seedling: "low", sprout: "medium", bloom: "high" };

function dateStrFromDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayStr() {
  return dateStrFromDate(new Date());
}

function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return dateStrFromDate(dt);
}

const GameStateContext = createContext(null);

function mapTaskToQuest(task) {
  const difficulty = PRIORITY_TO_DIFFICULTY[task.priority] || "sprout";
  const plantedDay =
    task.localDay ||
    (task.createdAt ? dateStrFromDate(new Date(task.createdAt)) : todayStr());
  return {
    id: task._id,
    title: task.title,
    notes: task.notes || "",
    difficulty,
    type: task.type || "daily",
    xp: DIFFICULTY_XP[difficulty],
    seeds: QUEST_SEEDS[task.type || "daily"]?.[difficulty] ?? 0,
    completed: task.done,
    dueDate: task.due || null,
    createdAt: task.createdAt,
    plantedDay,
    expiresDay: addDays(plantedDay, task.type === "weekly" ? 7 : 1),
    completedAt: task.completedAt || null,
    subtasks: (task.subtasks || []).map((s) => ({
      id: s._id,
      title: s.title,
      done: s.done,
    })),
    readyAt: task.createdAt
      ? new Date(task.createdAt).getTime() + COOLDOWN_MS[difficulty]
      : 0,
  };
}

export function GameStateProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [quests, setQuests] = useState([]);
  const [stats, setStats] = useState({ xp: 0, level: 1, coins: 0, streak: 0, xpIntoLevel: 0, xpForNextLevel: 100, totalCompleted: 0, todayCompleted: 0, dailyGoal: DAILY_STREAK_GOAL });
  const [shopItems, setShopItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [avatar, setAvatar] = useState({ outfit: "outfit1", hair: "hair1" });

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
      const res = await fetch(`${API}/tasks/stats?day=${todayStr()}`, { credentials: "include" });
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

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API}/notifications`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch {}
  }, []);

  const markNotificationRead = useCallback(async (notificationId) => {
    try {
      const res = await fetch(`${API}/notifications/${notificationId}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {}
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      const res = await fetch(`${API}/notifications/read-all`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
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
          await Promise.all([fetchQuests(), fetchStats(), fetchShopItems(), fetchInventory(), fetchEvents(), fetchNotifications()]);
        }
      } catch {}
      setAuthChecked(true);
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchNotifications, 60 * 1000);
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

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
          day: todayStr(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setQuests((prev) => [mapTaskToQuest(data.task), ...prev]);
        return { ok: true };
      }
      return { ok: false, error: data.error || "Could not create quest" };
    } catch {
      return { ok: false, error: "Could not create quest" };
    }
  }, []);

  const completeQuest = useCallback(async (questId) => {
    const res = await fetch(`${API}/tasks/${questId}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ day: todayStr() }),
    });
    if (res.ok) {
      const data = await res.json();
      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId
            ? { ...q, completed: true, completedAt: data.task.completedAt || q.completedAt }
            : q
        )
      );
      setStats((prev) => ({
        ...prev,
        xp: data.stats.xp,
        level: data.stats.level,
        coins: data.stats.coins,
      }));
      fetchStats();
    }
    return res.ok;
  }, [fetchStats]);

  const addSubtask = useCallback(async (questId, title) => {
    if (!title.trim()) return { ok: false, error: "Subtask title is required" };
    try {
      const res = await fetch(`${API}/tasks/${questId}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: title.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setQuests((prev) =>
          prev.map((q) => (q.id === questId ? mapTaskToQuest(data.task) : q))
        );
        return { ok: true };
      }
      return { ok: false, error: data.error || "Could not add subtask" };
    } catch {
      return { ok: false, error: "Could not add subtask" };
    }
  }, []);

  const toggleSubtask = useCallback(async (questId, subtaskId) => {
    try {
      const res = await fetch(`${API}/tasks/${questId}/subtasks/${subtaskId}`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setQuests((prev) =>
          prev.map((q) => (q.id === questId ? mapTaskToQuest(data.task) : q))
        );
      }
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  const deleteSubtask = useCallback(async (questId, subtaskId) => {
    try {
      const res = await fetch(`${API}/tasks/${questId}/subtasks/${subtaskId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setQuests((prev) =>
          prev.map((q) => (q.id === questId ? mapTaskToQuest(data.task) : q))
        );
      }
      return res.ok;
    } catch {
      return false;
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

  const togglePlaced = useCallback(async (itemId) => {
    try {
      const res = await fetch(`${API}/shop/place/${itemId}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory.items);
      }
    } catch {}
  }, []);

  const addEvent = useCallback(async ({ title, date, time = "", color = "amber", recurring = "none" }) => {
    const res = await fetch(`${API}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, date, time, color, recurring }),
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
    await Promise.all([fetchQuests(), fetchStats(), fetchShopItems(), fetchInventory(), fetchEvents(), fetchNotifications()]);
  }, [fetchQuests, fetchStats, fetchShopItems, fetchInventory, fetchEvents, fetchNotifications]);

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

  const forgotPassword = useCallback(async (email) => {
    const res = await fetch(`${API}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data.message;
  }, []);

  const resetPassword = useCallback(async (token, password) => {
    const res = await fetch(`${API}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data.message;
  }, []);

  const claimWelcomeBonus = useCallback(async () => {
    try {
      const res = await fetch(`${API}/auth/welcome-claim`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setUser((prev) => ({ ...prev, welcomeBonusClaimed: true }));
        setStats((prev) => ({ ...prev, coins: data.stats?.coins ?? prev.coins }));
        return { ok: true };
      }
      return { ok: false, error: data.error || "Could not claim welcome bonus" };
    } catch {
      return { ok: false, error: "Could not claim welcome bonus" };
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setQuests([]);
    setStats({ xp: 0, level: 1, coins: 0, streak: 0, xpIntoLevel: 0, xpForNextLevel: 100, totalCompleted: 0, todayCompleted: 0, dailyGoal: DAILY_STREAK_GOAL });
    setShopItems([]);
    setInventory([]);
    setEvents([]);
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const mappedInventory = shopItems.map((item) => {
    const owned = inventory.find((i) => i.itemId === item.itemId);
    const levelRequired = item.levelRequired || 1;
    return {
      id: item.itemId,
      name: item.name,
      icon: item.emoji,
      description: item.description,
      price: item.price,
      type: item.category,
      owned: !!owned,
      qty: owned ? owned.qty : 0,
      placed: owned ? !!owned.placed : false,
      image: PLANT_IMAGES[item.image] || null,
      levelRequired,
      locked: (stats.level || 1) < levelRequired,
    };
  });

  const value = {
    username: user?.username || "User",
    user,
    authChecked,
    welcomeBonusClaimed: user?.welcomeBonusClaimed ?? true,
    quests,
    xp: stats.xpIntoLevel || 0,
    level: stats.level,
    xpForNextLevel: stats.xpForNextLevel || 100,
    seeds: stats.coins,
    streak: stats.streak,
    totalCompleted: stats.totalCompleted,
    todayCompleted: stats.todayCompleted || 0,
    dailyGoal: stats.dailyGoal || DAILY_STREAK_GOAL,
    inventory: mappedInventory,
    events,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    avatar,
    setAvatar,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    claimWelcomeBonus,
    addQuest,
    completeQuest,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
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
