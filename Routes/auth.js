const express = require("express");
const router = express.Router();
const User = require("../Models/adminModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../controller/adminController");
const {protect} = require("../middleware/authMiddleware");

// reqistration
router.post("/signup", async (req, res, next) => {
  try {

    if (!req.body.email || !req.body.password) {
      return res.status(400).json("email or password missing");
    }

    // check if user already exists
    const userExists = await User.findOne({
      email: req.body.email,
    });
    if (userExists) {
      return res.status(400).json("user already exists");
    }

    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    // save new user and respond
    const user = await newUser.save();
    return res.status(200).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),

    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// login
router.post("/login", async (req, res, next) => {
  try {

    if (!req.body.email || !req.body.password) {
      return res.status(400).json("email or password missing");
    }

    
    // get user
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(404).json("user not found");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("wrong password");
    }

    return res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
