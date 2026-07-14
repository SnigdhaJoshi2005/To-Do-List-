const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
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
    notes: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    type: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    due: {
      type: String,
      default: "",
    },
    done: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, done: 1 });
taskSchema.index({ user: 1, completedAt: 1 });

module.exports = mongoose.model("Task", taskSchema);
