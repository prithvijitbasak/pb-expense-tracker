const express = require("express");
const {
  addExpense,
  getExpenseCategories,
} = require("../controllers/expenseController");
const expenseReportingController = require("../controllers/expenseReportingController");
const authMiddleware = require("../middlewares/authMiddleware");
const Expense = require("../models/expenseModel");

const router = express.Router();

router.route("/").post(authMiddleware, addExpense);
router.route("/categories").get(getExpenseCategories);
router
  .route("/total-expenses-by-date")
  .get(authMiddleware, expenseReportingController.getTotalExpensesByDate);

module.exports = router;
