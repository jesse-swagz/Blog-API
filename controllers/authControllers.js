require("dotenv").config({ path: "./config.env" });
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const User = require("../models/userModel");

const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    // input validation
    if (!firstname && !lastname && !email && !password) {
      res.status(400).json({
        status: "failed",
        message: "All fields are required",
      });
    }

    // check if user already exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.status(409).json({
        status: "failed",
        message: "User already exists. Please login",
      });
    }
    // if passwords match

    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
    });

    console.log(process.env.JWT_EXPIRES);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_SECRET_EXPIRES,
    });

    const cookieOptions = {
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    //Send Token To Client
    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({
      status: "success",
      message: "signup successful",
      data: {
        user,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "oops something went wrong",
      data: err,
    });
  }
};

const login = async (req, res) => {
  try {
    // Fetch User Data
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in DB
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET_EXPIRES,
      });

      const cookieOptions = {
        expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
        httpOnly: true,
      };
      if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

      //Send Token To Client
      res.cookie("jwt", token, cookieOptions);

      // user
      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
          userId: user.id,
          email: user.email,
          token,
        },
      });
    } else {
      res.status(400).json({
        message: "Incorrect login details",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const authorize = async (req, res, next) => {
  try {
    /** testing authorization**/
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).json({
        status: 403,
        message: "FORBIDDEN",
      });
    }

    const token = authHeader.split(" ")[1];

    const token_verification = jwt.verify(token, process.env.JWT_SECRET);

    //Check if user exists
    const currentUser = await User.findById(token_verification.user_id);

    if (!currentUser)
      return next(new appError(404, "Session expired, Login again!"));

    //Add user to req object
    req.user = currentUser;
    next();
    /** end of **/
  } catch (err) {
    res.status(500).json({
      message: "error",
      data: err,
    });
  }
};

module.exports = {
  signup,
  login,
  authorize,
};
