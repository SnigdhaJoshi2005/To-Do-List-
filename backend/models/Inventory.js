const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        itemId: { type: String, required: true },
        qty: { type: Number, default: 1, min: 1 },
      },
    ],
  },
  { timestamps: true }
);

inventorySchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model("Inventory", inventorySchema);
