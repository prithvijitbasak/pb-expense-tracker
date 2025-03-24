const mongoose = require("mongoose");
const Expense = require("../models/expenseModel");


// const getExpensesByDate = async (req, res) => {
//   try {
//     const { date } = req.query;
//     const userId = req.user.id; // Extract userId from authMiddleware

//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized: User ID not found" });
//     }

//     if (!date) {
//       return res.status(400).json({ error: "Missing date parameter" });
//     }

//     const startDate = new Date(date);
//     startDate.setHours(0, 0, 0, 0);

//     const endDate = new Date(date);
//     endDate.setHours(23, 59, 59, 999);

//     // Fetch total expenses and expense details
//     const expenses = await Expense.find({
//       user: userId,
//       date: { $gte: startDate, $lte: endDate },
//     }).select("-_id title amount category date notes createdAt");

//     // Calculate total expenses
//     const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

//     return res.status(200).json({
//       totalExpenses,
//       expenses, // Return all expense details
//     });
//   } catch (error) {
//     console.error("Error fetching expenses:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

const getExpensesByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.id; // Extract userId from authMiddleware

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }

    if (!date) {
      return res.status(400).json({ error: "Missing date parameter" });
    }

    // Convert DD-MM-YYYY to YYYY-MM-DD
    const dateParts = date.split("-");
    if (dateParts.length !== 3) {
      return res.status(400).json({ error: "Invalid date format. Use DD-MM-YYYY" });
    }

    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to YYYY-MM-DD

    const startDate = new Date(formattedDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(formattedDate);
    endDate.setHours(23, 59, 59, 999);

    // Fetch total expenses and expense details
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).select("-_id title amount category date notes createdAt");

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return res.status(200).json({
      totalExpenses,
      expenses, // Return all expense details
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = { getExpensesByDate };
