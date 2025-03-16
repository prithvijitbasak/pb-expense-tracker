const Expense = require("../models/expenseModel");
const validateExpense = require("../validators/expenseValidator");

const addExpense = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is set from authMiddleware

    let expenses = req.body;

    // Ensure expenses is an array
    if (!Array.isArray(expenses)) {
      expenses = [expenses]; // Convert single object to array
    }

    // Validate each expense and filter out invalid ones
    const validExpenses = [];
    const invalidExpenses = [];

    expenses.forEach((expense) => {
      const validationResult = validateExpense(expense);
      if (validationResult.success) {
        validExpenses.push({
          user: userId,
          title: validationResult.data.title,
          amount: validationResult.data.amount,
          category: validationResult.data.category,
          date: new Date(validationResult.data.date), // Convert date to Date object
          notes: validationResult.data.notes || "",
        });
      } else {
        invalidExpenses.push({
          expense,
          errors: validationResult.error.format(),
        });
      }
    });

    // Insert valid expenses into the database
    let insertedExpenses = [];
    if (validExpenses.length > 0) {
      insertedExpenses = await Expense.insertMany(validExpenses);
    }

    // Prepare response
    res.status(201).json({
      success: invalidExpenses.length === 0, // Partial success if some expenses failed
      message:
        invalidExpenses.length > 0
          ? "Some expenses were not added due to validation errors"
          : "Expenses added successfully",
      addedExpenses: insertedExpenses,
      failedExpenses: invalidExpenses,
    });
  } catch (error) {
    console.error("Error adding expenses:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { addExpense };
