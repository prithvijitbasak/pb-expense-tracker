const mongoose = require("mongoose");
const Expense = require("../models/expense.model");

const getExpensesByDateRange = async (req, res) => {
  try {
    const { startDateParam, endDateParam } = req.query;
    
    const userId = req.user.id; // Extract userId from authMiddleware

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }

    if (!startDateParam || !endDateParam) {
      return res
        .status(400)
        .json({ error: "Missing startDate or endDate parameter" });
    }

    // Convert DD-MM-YYYY to YYYY-MM-DD
    const startDateParts = startDateParam.split("-");
    const endDateParts = endDateParam.split("-");
    if (startDateParts.length !== 3 || endDateParts.length !== 3) {
      return res
        .status(400)
        .json({ error: "Invalid date format. Use DD-MM-YYYY" });
    }

    const formattedStartDate = `${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`; // Convert to YYYY-MM-DD
    const formattedEndDate = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`; // Convert to YYYY-MM-DD

    const startDate = new Date(formattedStartDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(formattedEndDate);
    endDate.setHours(23, 59, 59, 999);

    // console.log("Start date: ", startDate);
    // console.log("End date: ", endDate);

    // Fetch total expenses and expense details
    // 1. Calculate the sum directly in the database (Faster & more scalable)
    const totalStats = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalExpenses = totalStats.length > 0 ? totalStats[0].total : 0;
    

    // 2. Fetch the list (consider adding pagination here if the list is long!)
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).select("_id title amount category date notes createdAt updatedAt");

    return res.status(200).json({
      // Use Number.parseFloat().toFixed(2) or Intl.NumberFormat for the final string
      totalExpenses: totalExpenses.toFixed(2),
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getExpensesByDateRange };
