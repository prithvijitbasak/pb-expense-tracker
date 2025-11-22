const express = require("express");
const {
  addExpense,
  getExpenseCategories,
  editExpense,
  deleteExpense,
} = require("../controllers/expense.controller");
const expenseReportingController = require("../controllers/expenseReporting.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const Expense = require("../models/expense.model");
const { monthAnalytics, yearAnalytics, last7DaysAnalytics } = require("../controllers/analytics.controller");

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
router.route("/analytics/last7days").get(authMiddleware, last7DaysAnalytics);

module.exports = router;
