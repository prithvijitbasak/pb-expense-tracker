const Expense = require("../models/expenseModel");
const expenseCategories = require("../constants/expenseCategories");

const monthAnalytics = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Validate query params
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const userId = req.user._id; // ✅ Auth middleware already guarantees this

    const startDate = new Date(year, month - 1, 1); // month is 0-based
    const endDate = new Date(year, month, 1); // next month start

    const analytics = await Expense.aggregate([
      {
        $match: {
          user: userId, // ✅ consistent
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
        },
      },
      {
        $sort: { totalAmount: -1 }, // optional: sort by highest expense
      },
    ]);

    // ✅ Ensure all categories are always present
    const categories = expenseCategories;

    const result = categories.map((cat) => {
      const found = analytics.find((a) => a.category === cat);
      return {
        category: cat,
        totalAmount: found ? found.totalAmount : 0,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Month Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { monthAnalytics };
