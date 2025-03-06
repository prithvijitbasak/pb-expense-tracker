const mongoose = require("mongoose");

const URI = process.env.DB_KEY;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connection to the database is successfull");
  } catch (error) {
    console.log("Database Connection Failed");
    process.exit(0);
  }
};

module.exports = connectDb;
