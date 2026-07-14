const express = require("express");
const auth = require("../middleware/auth");
const Item = require("../models/Item");
const Inventory = require("../models/Inventory");
const User = require("../models/User");

const router = express.Router();

// GET /api/shop/items — list all shop items
router.get("/items", auth, async (req, res) => {
  try {
    const items = await Item.find().sort({ price: 1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/shop/buy — buy an item
router.post("/buy", auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: "itemId is required" });
    }

    const item = await Item.findOne({ itemId });
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const user = await User.findById(req.user._id);
    if (user.stats.coins < item.price) {
      return res.status(400).json({ error: "Not enough coins" });
    }

    user.stats.coins -= item.price;
    await user.save();

    let inventory = await Inventory.findOne({ user: req.user._id });
    if (!inventory) {
      inventory = await Inventory.create({ user: req.user._id, items: [] });
    }

    const existing = inventory.items.find(
      (i) => i.itemId.toString() === itemId
    );
    if (existing) {
      existing.qty += 1;
    } else {
      inventory.items.push({ itemId, qty: 1 });
    }

    await inventory.save();

    res.json({ coins: user.stats.coins, inventory });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/shop/inventory — get user's inventory
router.get("/inventory", auth, async (req, res) => {
  try {
    let inventory = await Inventory.findOne({ user: req.user._id });
    if (!inventory) {
      inventory = { items: [] };
    }
    res.json({ inventory });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
