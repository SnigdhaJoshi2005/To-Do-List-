const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      enum: ["mint", "sky", "pink", "lavender"],
      default: "mint",
    },
  },
  { timestamps: true }
);

eventSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("Event", eventSchema);
