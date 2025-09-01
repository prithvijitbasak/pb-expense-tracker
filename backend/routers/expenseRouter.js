const express = require("express");
const {
  addExpense,
  getExpenseCategories,
  editExpense,
  deleteExpense,
} = require("../controllers/expenseController");
const expenseReportingController = require("../controllers/expenseReportingController");
const authMiddleware = require("../middlewares/authMiddleware");
const Expense = require("../models/expenseModel");
const { monthAnalytics, yearAnalytics } = require("../controllers/analytics.controller");

const router = express.Router();

router.route("/").post(authMiddleware, addExpense);
router.route("/categories").get(getExpenseCategories);
router
  .route("/get-expenses-by-date")
  .get(authMiddleware, expenseReportingController.getExpensesByDate);
router
  .route("/get-expenses-by-month")
  .get(authMiddleware, expenseReportingController.getExpensesByMonth);
router
  .route("/get-expenses-by-year")
  .get(authMiddleware, expenseReportingController.getExpensesByYear);
router.route("/edit").patch(authMiddleware, editExpense);
router.route("/:id").delete(authMiddleware, deleteExpense);
router.route("/analytics/month").get(authMiddleware, monthAnalytics);
router.route("/analytics/year").get(authMiddleware, yearAnalytics);

module.exports = router;
