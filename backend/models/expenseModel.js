const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: [
        "Savings",
        "Food",
        "Transport",
        "Grocery",
        "Bill",
        "Medicine",
        "Shopping",
        "Entertainment",
        "Other",
      ],
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt and updatedAt automatically
  }
);

const Expense = mongoose.model("Expense", ExpenseSchema);
module.exports = Expense;
