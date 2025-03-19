const mongoose = require("mongoose");
const Expense = require("../models/expenseModel");

const getTotalExpensesByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const userId = req.user.id; // Extract userId from authMiddleware

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found" });
    }

    if (!date) {
      return res.status(400).json({ error: "Missing date parameter" });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const result = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
        },
      },
    ]);

    return res.status(200).json({
      totalExpenses: result.length > 0 ? result[0].totalExpenses : 0,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getTotalExpensesByDate };
