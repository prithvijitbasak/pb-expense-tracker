const Expense = require("../models/expenseModel");
const validateExpense = require("../validators/expenseValidator");

const addExpense = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` is set from authMiddleware

    let expenses = req.body;
    console.log("Request Body Received:", req.body);

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

// Controller to fetch expense categories
const getExpenseCategories = (req, res) => {
  try {
    const categories = Expense.schema.path("category").enumValues;
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

const editExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const { _id, ...expenseData } = req.body;

    console.log("Edit Request Received:", req.body);

    // Check for missing _id
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID (_id) is required to perform an update.",
      });
    }

    // Validate updated data (excluding _id)
    const validationResult = validateExpense(expenseData);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed for the expense data.",
        errors: validationResult.error.format(),
      });
    }

    // Check if the expense exists and belongs to the user
    const existingExpense = await Expense.findOne({ _id, user: userId });
    if (!existingExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found or you are not authorized to update it.",
      });
    }

    // Prepare update data
    const updatedData = {
      title: validationResult.data.title,
      amount: validationResult.data.amount,
      category: validationResult.data.category,
      date: new Date(validationResult.data.date),
      notes: validationResult.data.notes || "",
    };

    // Perform update
    const updatedExpense = await Expense.findByIdAndUpdate(_id, updatedData, {
      new: true, // Return updated document
      runValidators: true, // Ensure schema-level validation runs again
    });

    res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      updatedExpense,
    });
  } catch (error) {
    console.error("Error editing expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


module.exports = { addExpense, getExpenseCategories, editExpense };
