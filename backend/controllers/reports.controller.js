const mongoose = require("mongoose");
const Expense = require("../models/expense.model");

const getExpensesByDateRange = async (req, res) => {
  try {
    const { startDateParam, endDateParam, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!startDateParam || !endDateParam) {
        return res.status(400).json({ error: "Missing date parameters" });
    }

    // Convert strings to numbers to ensure math works correctly
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

   
    const startDateParts = startDateParam.split("-");
    const endDateParts = endDateParam.split("-");
    const formattedStartDate = `${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`;
    const formattedEndDate = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`;
    const startDate = new Date(formattedStartDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(formattedEndDate);
    endDate.setHours(23, 59, 59, 999);

    // 1. Get Total Stats (Aggregate)
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
          totalAmount: { $sum: "$amount" },
          totalCount: { $sum: 1 }, // Useful to know total records for UI pagination
        },
      },
    ]);

    const totalAmount = totalStats.length > 0 ? totalStats[0].totalAmount : 0;
    const totalRecords = totalStats.length > 0 ? totalStats[0].totalCount : 0;

    // 2. Fetch Paginated List
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    })
      .select("_id title amount category date notes createdAt updatedAt")
      .sort({ date: -1 }) // Usually best to show newest first
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      totalAmount: totalAmount.toFixed(2),
      pagination: {
        totalRecords,
        currentPage: pageNum,
        totalPages: Math.ceil(totalRecords / limitNum),
        limit: limitNum
      },
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getExpensesByDateRange };
