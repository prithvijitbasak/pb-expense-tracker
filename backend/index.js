require("dotenv").config();
const express = require("express");
const app = express();
const authRoute = require("./routers/authRouter");
var bodyParser = require("body-parser");
const cors = require("cors");
const connectDb = require("./utils/db");
const PORT = 5001;

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

// using router
app.use("/api/auth", authRoute);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
