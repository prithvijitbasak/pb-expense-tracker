const Expense = require("../models/expense.model");
const expenseCategories = require("../constants/expenseCategories");
const mongoose = require("mongoose");

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
    const startDate = new Date(year, 0, 1); // Jan 1st, 00:00:00
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
    const userId = req.user.id;
    // console.log("User ID for Last 7 Days Analytics:", req.user);

    const today = new Date();
    const tz = req.user.timezone || "UTC"; // Default to UTC if timezone is not set

    // Create dates for the last 7 days (including today)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
    // console.log("Start Date for Last 7 Days Analytics:", startDate);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);
    // console.log("End Date for Last 7 Days Analytics:", endDate);

    const analytics = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            dateStr: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$date",
                timezone: tz,
              },
            },
            category: "$category",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    // console.log("Raw Analytics Data for Last 7 Days:", analytics);

    // Map the DB results for easy lookup
    const resultMap = {};
    analytics.forEach((item) => {
      const { dateStr, category } = item._id;
      if (!resultMap[dateStr]) resultMap[dateStr] = {};
      resultMap[dateStr][category] = item.totalAmount;
    });

    // Generate the last 7 days including today
    const finalData = [];
    const categories = expenseCategories;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const dateKey = `${day}-${month}-${year}`;

      const dayName = d.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: tz,
      });

      const dayEntry = {
        date: dateKey,
        day: dayName,
      };

      categories.forEach((cat) => {
        dayEntry[cat] = resultMap[dateKey]?.[cat] || 0;
      });

      finalData.push(dayEntry);
    }

    res.status(200).json(finalData);
  } catch (error) {
    console.error("Last 7 Days Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { monthAnalytics, yearAnalytics, last7DaysAnalytics };
