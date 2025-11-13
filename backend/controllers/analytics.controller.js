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

const yearAnalytics = async (req, res) => {
  try {
    const { year } = req.query;

    // ✅ Validate query param
    if (!year) {
      return res.status(400).json({ message: "Year is required" });
    }

    const userId = req.user._id; // ✅ From authMiddleware

    // ✅ Define the full year range
    const startDate = new Date(year, 0, 1);  // Jan 1st, 00:00:00
    const endDate = new Date(Number(year) + 1, 0, 1); // Next year's Jan 1st

    // ✅ MongoDB aggregation
    const analytics = await Expense.aggregate([
      {
        $match: {
          user: userId, // Only this user's expenses
          date: { $gte: startDate, $lt: endDate }, // Expenses within the year
        },
      },
      {
        $group: {
          _id: "$category", // Group by category
          totalAmount: { $sum: "$amount" }, // Sum amounts
        },
      },
      {
        $project: {
          _id: 0, // Remove _id
          category: "$_id", // Rename
          totalAmount: 1, // Keep totalAmount
        },
      },
      {
        $sort: { totalAmount: -1 }, // Optional: highest expense first
      },
    ]);

    // ✅ Ensure all categories appear (even if 0)
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
    console.error("Year Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const last7DaysAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // tomorrow
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6); // 6 days ago

    const analytics = await Expense.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $project: {
          category: 1,
          amount: 1,
          dayOfWeek: { $dayOfWeek: "$date" }, // 1 (Sun) - 7 (Sat)
        },
      },
      {
        $group: {
          _id: { dayOfWeek: "$dayOfWeek", category: "$category" },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    // Helper: map MongoDB dayOfWeek → readable weekday
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const categories = expenseCategories; // e.g., ['Food', 'Travel', 'Shopping', 'Bills']

    // Step 1: Build map from aggregation results
    const resultMap = {};
    analytics.forEach((a) => {
      const dayName = weekDays[a._id.dayOfWeek - 1];
      if (!resultMap[dayName]) resultMap[dayName] = {};
      resultMap[dayName][a._id.category] = a.totalAmount;
    });

    // Step 2: Build the final 7-day data (in chronological order)
    const finalData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = weekDays[d.getDay()];

      const dayData = { day: dayName };
      categories.forEach((cat) => {
        dayData[cat] = resultMap[dayName]?.[cat] || 0;
      });

      finalData.push(dayData);
    }

    res.status(200).json(finalData);
  } catch (error) {
    console.error("Last 7 Days Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { monthAnalytics, yearAnalytics, last7DaysAnalytics };
