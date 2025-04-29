const mongoose = require("mongoose");
const Expense = require("../models/expenseModel");

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
      return res
        .status(400)
        .json({ error: "Invalid date format. Use DD-MM-YYYY" });
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
    }).select("_id title amount category date notes createdAt updatedAt");

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return res.status(200).json({
      totalExpenses,
      expenses, // Return all expense details
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getExpensesByMonth = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id; // Extract user ID from authMiddleware

    // Check if userId is available
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized! No user ID found" });
    }

    // Validate month and year
    if (!month || !year) {
      return res.status(400).json({ error: "Missing month or year parameter" });
    }

    // Ensure month is between 1 and 12 and year is valid
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: "Invalid month or year format" });
    }

    // Construct the start and end date for the given month
    const startDate = new Date(yearNum, monthNum - 1, 1); // First day of the month
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999); // Last day of the month

    // Fetch expenses for the given month
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).select("_id title amount category date notes createdAt updatedAt");

    // Calculate total expenses
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return res.status(200).json({
      totalExpenses,
      expenses, // Return all expense details
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getExpensesByYear = async (req, res) => {
  try {
    const { year } = req.query;
    const userId = req.user.id;

    // 1. 🔐 Authorization & Validation
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized! No user ID found" });
    }

    if (!year) {
      return res.status(400).json({ error: "Missing year parameter" });
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1000 || yearNum > 9999) {
      return res.status(400).json({ error: "Invalid year format" });
    }

    // 2. 📆 Define Start and End Dates for the Year
    const startDate = new Date(yearNum, 0, 1); // Jan 1st
    const endDate = new Date(yearNum, 11, 31, 23, 59, 59, 999); // Dec 31st

    // 3. 📊 Aggregation to Calculate Monthly Totals
    const aggregation = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" } }, // Month number (1–12)
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          month: { $subtract: ["$_id.month", 1] }, // Convert to 0-based index (0–11)
          totalAmount: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 }, // ✅ Ensures month order: Jan → Dec
      },
    ]);

    // 4. 🗓️ Prepare Default Monthly Expenses Object (00 to 11)
    const monthlyExpenses = {};
    for (let month = 0; month < 12; month++) {
      const monthFormatted = month.toString().padStart(2, "0");
      monthlyExpenses[monthFormatted] = 0;
    }

    // 5. 🧮 Fill in Monthly Totals from Aggregation
    aggregation.forEach((item) => {
      const monthFormatted = item.month.toString().padStart(2, "0");
      monthlyExpenses[monthFormatted] = item.totalAmount;
    });

    // 6. 📜 Fetch All Expenses for the Year
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .select("_id title amount category date notes createdAt updatedAt")
      .sort({ date: 1 }); // ✅ Sorted by date ascending for frontend display

    // 7. 💰 Calculate Grand Total
    const totalExpenses = aggregation.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    // 8. 📦 Send the Response
    return res.status(200).json({
      totalExpenses,       // total sum for year
      monthlyExpenses,     // { "00": 5000, "01": 800, ... }
      expenses,            // all individual expense documents for frontend
    });
  } catch (error) {
    console.error("Error fetching yearly expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};





module.exports = { getExpensesByDate, getExpensesByMonth, getExpensesByYear };
