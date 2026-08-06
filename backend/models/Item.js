const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    levelRequired: {
      type: Number,
      default: 1,
      min: 1,
    },
    category: {
      type: String,
      enum: ["plants", "decor", "pets", "expansions"],
      default: "plants",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);
