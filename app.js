require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");

const setHeaders = require("./middleware/setHeaders");
const errorMiddleware = require("./middleware/error");

const authRoutes = require("./routes/auth");
const watchlistRoutes = require("./routes/watchlist");

const app = express();

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(setHeaders);

app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

app.use(errorMiddleware);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.9r7m1gx.mongodb.net/${process.env.MONGODB_DEFAULT_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => console.log(err));
