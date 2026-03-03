const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");

const JWT_SECRET = process.env.JWT_SECRET || "jwtSecretVeryConfidential";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 3600 * 1000, // 1 hour in ms
};

const register = async (req, res) => {
  const { username, email, usertype, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      usertype,
      password: hashedPassword,
    });

    const userCreated = await newUser.save();

    const token = jwt.sign({ id: userCreated._id }, JWT_SECRET, {
      expiresIn: 3600,
    });

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      _id: userCreated._id,
      username: userCreated.username,
      email: userCreated.email,
      usertype: userCreated.usertype,
      balance: userCreated.balance,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
    res.cookie("token", token, cookieOptions);

    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      usertype: user.usertype,
      balance: user.balance,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).send("Logged out successfully");
};

const fetchUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error occured" });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "error occured" });
  }
};

module.exports = {
  fetchUsers,
  fetchUserById,
  logout,
  login,
  register,
};
