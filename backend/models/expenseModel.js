const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Index for faster user-based queries
  },
  title: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
  },
  amount: {
    type: Number,
    required: true,
    min: 0, // Ensures no negative values
  },
  category: {
    type: String,
    enum: ["Food", "Transport", "Shopping", "Bill", "Entertainment", "Grocery", "Other"],
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    trim: true, // Allows optional notes with trimmed spaces
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Expense = mongoose.model("Expense", ExpenseSchema);

module.exports = Expense;
