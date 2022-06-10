if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const setHeaders = require("./middleware/setHeaders");
const error = require("./middleware/error");

const authRoutes = require("./routes/auth");

const app = express();

app.use(bodyParser.json());
app.use(setHeaders);

app.use("/auth", authRoutes);

app.use(error);

mongoose
  .connect(
    "mongodb+srv://merthelvaci:uXrd8skBTKNA6wOF@cluster0.9r7m1gx.mongodb.net/moviedb?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(4000, () => console.log("Server listening on port 4000..."));
  })
  .catch((err) => console.log(err));
