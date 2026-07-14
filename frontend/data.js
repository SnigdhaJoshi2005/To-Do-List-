/**
 * Questify — Data Layer
 * Single source of truth for all persisted state.
 * Everything lives in localStorage under the "questify_state" key.
 * No page should touch localStorage directly — always go through QData.
 */

const QData = (() => {
  const STORAGE_KEY = "questify_state";

  const XP_PER_LEVEL = 100; // flat curve: level up every 100 XP
  const COINS_PER_TASK = { low: 5, medium: 10, high: 20 };
  const XP_PER_TASK = { low: 10, medium: 20, high: 35 };

  const DEFAULT_STATE = {
    user: { name: "User" },
    stats: { xp: 0, level: 1, coins: 50, streak: 0, lastCompletedDate: null },
    tasks: [], // {id, title, notes, priority, due, done, category, createdAt}
    events: [], // {id, title, date, time, color}
    garden: { plots: [] }, // {id, plantId, plantedAt, stage}
    inventory: [], // {itemId, qty}
    achievements: [], // ids of unlocked achievements
    settings: { theme: "default" },
  };

  function _read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      // shallow-merge with defaults so new fields introduced later don't break old saves
      return { ...structuredClone(DEFAULT_STATE), ...parsed };
    } catch (e) {
      console.warn("Questify: failed to read state, resetting.", e);
      return structuredClone(DEFAULT_STATE);
    }
  }

  function _write(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("questify:update", { detail: state }));
  }

  function getState() {
    return _read();
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ---------- User ----------
  function getUserName() {
    return _read().user.name || "User";
  }

  // ---------- Tasks ----------
  function getTasks() {
    return _read().tasks;
  }

  function addTask({ title, notes = "", priority = "medium", due = "", category = "general" }) {
    const state = _read();
    const task = {
      id: uid(),
      title,
      notes,
      priority,
      due,
      category,
      done: false,
      createdAt: new Date().toISOString(),
    };
    state.tasks.unshift(task);
    _write(state);
    return task;
  }

  function updateTask(id, patch) {
    const state = _read();
    const idx = state.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    state.tasks[idx] = { ...state.tasks[idx], ...patch };
    _write(state);
    return state.tasks[idx];
  }

  function deleteTask(id) {
    const state = _read();
    state.tasks = state.tasks.filter((t) => t.id !== id);
    _write(state);
  }

  function toggleTaskDone(id) {
    const state = _read();
    const task = state.tasks.find((t) => t.id === id);
    if (!task) return null;

    task.done = !task.done;

    if (task.done) {
      const xp = XP_PER_TASK[task.priority] || 10;
      const coins = COINS_PER_TASK[task.priority] || 5;
      _applyRewards(state, xp, coins);
      _bumpStreak(state);
    } else {
      // undo rewards if unchecked
      const xp = XP_PER_TASK[task.priority] || 10;
      const coins = COINS_PER_TASK[task.priority] || 5;
      state.stats.xp = Math.max(0, state.stats.xp - xp);
      state.stats.coins = Math.max(0, state.stats.coins - coins);
      _recalcLevel(state);
    }

    _write(state);
    return task;
  }

  // ---------- Stats / XP / Level ----------
  function _recalcLevel(state) {
    state.stats.level = Math.floor(state.stats.xp / XP_PER_LEVEL) + 1;
  }

  function _applyRewards(state, xp, coins) {
    state.stats.xp += xp;
    state.stats.coins += coins;
    _recalcLevel(state);
  }

  function _bumpStreak(state) {
    const today = new Date().toISOString().slice(0, 10);
    const last = state.stats.lastCompletedDate;
    if (last === today) return; // already counted today
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state.stats.streak = last === yesterday ? state.stats.streak + 1 : 1;
    state.stats.lastCompletedDate = today;
  }

  function getStats() {
    const state = _read();
    const { xp, level, coins, streak } = state.stats;
    const xpIntoLevel = xp % XP_PER_LEVEL;
    return {
      xp,
      level,
      coins,
      streak,
      xpIntoLevel,
      xpForNextLevel: XP_PER_LEVEL,
      xpPercent: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
    };
  }

  function spendCoins(amount) {
    const state = _read();
    if (state.stats.coins < amount) return false;
    state.stats.coins -= amount;
    _write(state);
    return true;
  }

  // ---------- Events / Calendar ----------
  function getEvents() {
    return _read().events;
  }

  function addEvent({ title, date, time = "", color = "mint" }) {
    const state = _read();
    const event = { id: uid(), title, date, time, color };
    state.events.push(event);
    _write(state);
    return event;
  }

  function deleteEvent(id) {
    const state = _read();
    state.events = state.events.filter((e) => e.id !== id);
    _write(state);
  }

  // ---------- Inventory / Garden ----------
  function addItem(itemId, qty = 1) {
    const state = _read();
    const existing = state.inventory.find((i) => i.itemId === itemId);
    if (existing) existing.qty += qty;
    else state.inventory.push({ itemId, qty });
    _write(state);
  }

  function getInventory() {
    return _read().inventory;
  }

  // ---------- Analytics helpers ----------
  function getCompletionsByDay(days = 7) {
    const state = _read();
    const buckets = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      buckets[d] = 0;
    }
    state.tasks.forEach((t) => {
      if (!t.done) return;
      const d = (t.createdAt || "").slice(0, 10);
      if (d in buckets) buckets[d] += 1;
    });
    return buckets;
  }

  function resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    _write(_read());
  }

  return {
    getState,
    getUserName,
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskDone,
    getStats,
    spendCoins,
    getEvents,
    addEvent,
    deleteEvent,
    addItem,
    getInventory,
    getCompletionsByDay,
    resetAll,
  };
})();
