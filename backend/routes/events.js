const express = require("express");
const auth = require("../middleware/auth");
const Event = require("../models/Event");

const router = express.Router();

// GET /api/events
router.get("/", auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).sort({ date: 1 });
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/events
router.post("/", auth, async (req, res) => {
  try {
    const { title, date, time, color } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }

    const event = await Event.create({
      user: req.user._id,
      title: title.trim(),
      date,
      time: time || "",
      color: color || "mint",
    });

    res.status(201).json({ event });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/events/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
