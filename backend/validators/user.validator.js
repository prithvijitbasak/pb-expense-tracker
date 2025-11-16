const { z } = require("zod");
const {
  fullName,
  username,
  email,
  phone,
} = require("../validators/authValidator");

const updateUserSchema = z.object({
  fullName: fullName.optional(),
  username: username.optional(),
  email: email.optional(),
  phone: phone.optional(),
});

module.exports = updateUserSchema;
