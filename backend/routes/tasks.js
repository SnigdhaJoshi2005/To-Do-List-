const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const User = require("../models/User");

const router = express.Router();

const XP_REWARDS = { low: 10, medium: 20, high: 35 };
const COIN_REWARDS = { low: 5, medium: 10, high: 20 };

function xpForLevel(level) {
  return level * 100;
}

function recalcLevel(xp) {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return level;
}

// GET /api/tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/tasks
router.post("/", auth, async (req, res) => {
  try {
    const { title, notes, priority, type, due } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      notes: notes || "",
      priority: priority || "medium",
      type: type || "daily",
      due: due || "",
    });

    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/tasks/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { title, notes, priority, type, due } = req.body;
    if (title !== undefined) task.title = title.trim();
    if (notes !== undefined) task.notes = notes;
    if (priority !== undefined) task.priority = priority;
    if (type !== undefined) task.type = type;
    if (due !== undefined) task.due = due;

    await task.save();
    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/tasks/:id/toggle
router.patch("/:id/toggle", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const user = await User.findById(req.user._id);

    task.done = !task.done;

    if (task.done) {
      // Award XP and coins
      const xp = XP_REWARDS[task.priority] || 10;
      const coins = COIN_REWARDS[task.priority] || 5;
      user.stats.xp += xp;
      user.stats.coins += coins;
      user.stats.level = recalcLevel(user.stats.xp);
      task.completedAt = new Date();
    } else {
      // Revoke XP and coins
      const xp = XP_REWARDS[task.priority] || 10;
      const coins = COIN_REWARDS[task.priority] || 5;
      user.stats.xp = Math.max(0, user.stats.xp - xp);
      user.stats.coins = Math.max(0, user.stats.coins - coins);
      user.stats.level = recalcLevel(user.stats.xp);
      task.completedAt = null;
    }

    await task.save();
    await user.save();

    res.json({ task, stats: user.stats });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/tasks/stats (streak computed live from completion history)
router.get("/stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const tasks = await Task.find({ user: req.user._id, done: true }).select(
      "completedAt"
    );

    // Compute streak from completion history
    const completionDates = new Set();
    tasks.forEach((t) => {
      if (t.completedAt) {
        const d = t.completedAt.toISOString().slice(0, 10);
        completionDates.add(d);
      }
    });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const check = new Date(today);
      check.setDate(check.getDate() - i);
      const dateStr = check.toISOString().slice(0, 10);
      if (completionDates.has(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    const xpIntoLevel = user.stats.xp;
    let accumulated = 0;
    let currentLevel = 1;
    while (accumulated + xpForLevel(currentLevel) <= xpIntoLevel) {
      accumulated += xpForLevel(currentLevel);
      currentLevel++;
    }

    res.json({
      xp: user.stats.xp,
      level: user.stats.level,
      coins: user.stats.coins,
      streak,
      xpIntoLevel: xpIntoLevel - accumulated,
      xpForNextLevel: xpForLevel(currentLevel),
      totalCompleted: tasks.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
