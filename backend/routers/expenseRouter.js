const express = require("express");
const {
  addExpense,
  getExpenseCategories,
} = require("../controllers/expenseController");
const authMiddleware = require("../middlewares/authMiddleware");
const Expense = require("../models/expenseModel");

const router = express.Router();

router.route("/").post(authMiddleware, addExpense);
router.route("/categories").get(getExpenseCategories);

module.exports = router;
