const { z } = require("zod");
const expenseCategories = require("../constants/expenseCategories");

// Helper function to convert 'dd-mm-yyyy' to a Date object
const parseDate = (val) => {
  if (typeof val !== "string") return val; // Ensure it's a string before processing

  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = val.match(dateRegex);

  if (!match) return NaN; // Invalid format

  const [, day, month, year] = match.map(Number);
  return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
};

// Define the validation schema
const expenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"), // Fixed typo in max limit
  amount: z.number().min(0, "Amount cannot be negative"),
  category: z.enum(expenseCategories),
  date: z.preprocess(
    parseDate,
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format. Expected dd-mm-yyyy",
    })
  ),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be at most 500 characters")
    .optional(),
});

// Validation function
const validateExpense = (expenseData) => {
  return expenseSchema.safeParse(expenseData);
};

module.exports = validateExpense;
