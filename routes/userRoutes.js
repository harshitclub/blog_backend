const { getAllUsers, signup, login } = require("../controllers/userController");

const express = require("express");
const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", signup);
userRouter.post("/login", login);

module.exports = { userRouter };
