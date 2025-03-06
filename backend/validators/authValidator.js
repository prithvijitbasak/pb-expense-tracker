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
const signupSchema = z.object({
  fullName: z.string({ required_error: "Please enter your full name" }).trim(),
  username: z
    .string({ required_error: "Please enter a username" })
    .trim()
    .min(3, { message: "The username must have atleast 3 characters" })
    .max(50, { message: "The username can only be up to 50 characters" }),
  email: z
    .string({ required_error: "Please enter your email" })
    .trim()
    .email({ message: "Invalid email" }), // Validates phone number must be 10 digits
  phone: z
    .string({ required_error: "Please enter your phone number" })
    .trim()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
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
    ),
  dateOfBirth: z
    .string({ required_error: "Please enter your date of birth" })
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
      message: "Date of birth must be in dd/mm/yyyy format",
    }), // Validates date format as dd/mm/yyyy
});

module.exports = { signupSchema, loginSchema };
