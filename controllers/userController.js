const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    return console.log(error);
  }
  if (!users) {
    return res.status(404).json({ message: "No Users Found!" });
  }
  return res.status(200).json({ users });
};

const signup = async (req, res, next) => {
  let existingUsers;
  try {
    const { name, email, password } = await req.body;

    existingUsers = await User.findOne({ email });

    if (existingUsers) {
      return res
        .status(400)
        .json({ message: "User Already Registered | Login Instead" });
    }
    var salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(password, salt);
    const user = new User({
      name,
      email,
      password: hashPassword,
      blogs: [],
    });
    try {
      await user.save();
    } catch (error) {
      return console.log(error);
    }
    return res.status(201).json({ message: "User Registered!" });
  } catch (error) {
    return console.log(error);
  }
};

const login = async (req, res, next) => {
  let existingUser;
  try {
    const { email, password } = await req.body;
    existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const checkPassword = await bcrypt.compare(password, existingUser.password);

    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }
    return res.status(200).json({ message: "Login Success!" });
  } catch (error) {
    return console.log(error);
  }
};

module.exports = { getAllUsers, signup, login };
