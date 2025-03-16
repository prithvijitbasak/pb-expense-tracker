const Expense = require("../models/expenseModel");
const validateExpense = require("../validators/expenseValidator");

const addExpense = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is set from authMiddleware

    // Validate request data
    const validationResult = validateExpense(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.format(),
      });
    }

    // Extract validated data
    const { title, amount, category, date, notes } = validationResult.data;

    // Create new expense
    const newExpense = new Expense({
      user: userId,
      title,
      amount,
      category,
      date: new Date(date), // Ensure date is properly formatted
      notes: notes || "", // Default to empty string if notes are not provided
    });

    // Save to database
    await newExpense.save();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { addExpense };
