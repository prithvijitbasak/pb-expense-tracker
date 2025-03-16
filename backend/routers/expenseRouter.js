const express = require("express");
const { addExpense } = require("../controllers/expenseController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(authMiddleware, addExpense);

module.exports = router;
