const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (error) {
    console.log(error);

    const status = 400;
    const message = "Validation failed";
    const extraDetails = error.errors[0].message;

    const err = {
      status,
      message,
      extraDetails,
    };

    next(err);
  }
};

module.exports = validate;
