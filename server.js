const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const { userRouter } = require("./routes/userRoutes");
const { blogRouter } = require("./routes/blogRoutes");

const PORT = process.env.PORT || 6001;
const MONGODB_URI = process.env.MONGODB_URI;
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

mongoose
  .connect(MONGODB_URI)
  .then(
    app.listen(PORT, () => {
      console.log(`server start at ${PORT}`);
    })
  )
  .then(console.log("Database Connected!"));
