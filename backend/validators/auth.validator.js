const { z } = require("zod");

// Login schema with validation for username, email, or phone (identifier)
const loginSchema = z.object({
  identifier: z
    .string({ required_error: "Username, email, or phone must be present" })
    .trim()
    .min(3, { message: "The identifier must have at least 3 characters" })
    .max(50, { message: "The identifier can only be up to 50 characters" }),
  password: z
    .string({ required_error: "Password must be present" })
    .trim()
    .min(8, { message: "Password should have at least 8 characters" })
    .max(50, { message: "Password can only be up to 50 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/,
      {
        message:
          "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
      }
    ), // Custom regex ensures password has required complexity
});

// Signup schema with validations for full name, email, phone, and date of birth
// Reusable field validators
const fullName = z
  .string({ required_error: "Please enter your full name" })
  .trim();

const username = z
  .string({ required_error: "Please enter a username" })
  .trim()
  .min(3, { message: "The username must have atleast 3 characters" })
  .max(50, { message: "The username can only be up to 50 characters" })
  .regex(/^(?=.*[A-Za-z])[A-Za-z0-9]+$/, {
    message: "The username can contain letter and number only",
  });

const email = z
  .string({ required_error: "Please enter your email" })
  .trim()
  .email({ message: "Invalid email" });

const phone = z
  .string({ required_error: "Please enter your phone number" })
  .trim()
  .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" });

const password = z
  .string({ required_error: "Password must be present" })
  .trim()
  .min(8, { message: "Password should have at least 8 characters" })
  .max(50, { message: "Password can only be up to 50 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/, {
    message:
      "Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
  });

// Signup schema using the reusable fields
const signupSchema = z.object({
  fullName,
  username,
  email,
  phone,
  password,
});


module.exports = { signupSchema, loginSchema, fullName, username, email, phone };
