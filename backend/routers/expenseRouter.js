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

const router = express.Router();

router.route("/").post(authMiddleware, addExpense);
router.route("/categories").get(getExpenseCategories);
router
  .route("/get-expenses-by-date")
  .get(authMiddleware, expenseReportingController.getExpensesByDate);
router
  .route("/get-expenses-by-month")
  .get(authMiddleware, expenseReportingController.getExpensesByMonth);
router.route("/edit").patch(authMiddleware, editExpense);
router.route("/:id").delete(authMiddleware, deleteExpense);

module.exports = router;
