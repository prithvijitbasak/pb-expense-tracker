require("dotenv").config();
const express = require("express");
const app = express();
const authRoute = require("./routers/authRouter");
const expenseRoute = require("./routers/expenseRouter");
const userRoute = require("./routers/user.router");
var bodyParser = require("body-parser");
const cors = require("cors");
const connectDb = require("./utils/db");
const PORT = 5001;

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

// using router
app.use("/api/auth", authRoute);
app.use("/api/expenses", expenseRoute);
app.use("/api/users", userRoute);


app.use((err, req, res, next) => {
  const status = err.status || 500;
  
  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong",
    extraDetails: err.extraDetails || null,
  });
});


connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});