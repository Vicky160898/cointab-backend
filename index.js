require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connect = require("./config/db");
const UserRouter = require("./routes/userRoute");
const cors = require("cors");
const app = express();

//Taking Port if it is present in our env file otherwise by default 8080.

const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.set("strictQuery", false);

//here route of all the request..

app.use("/api", UserRouter);

//here we creating server with the help of express..

connect();
app.listen(PORT, () => {
  console.log(`server started on Port ${PORT}`);
});
