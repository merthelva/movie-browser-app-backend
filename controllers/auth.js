const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const modifyError = require("../utilties/modifyError");

exports.signup = async (req, res, next) => {
  const { errors } = validationResult(req);
  const modifiedErrors = {};

  // error object possibly contains the errors which will be thrown
  // when validation check(s) inside ../routes/auth.js file fail(s)
  /**
   * ========= POSSIBLE ERRORS =========
   * 1) Email might already be registered
   * 2) Entered email is invalid
   * 3) Entered password is invalid
   * 4) Entered confirmPassword is invalid
   */
  if (errors.length > 0) {
    const error = new Error();
    error.statusCode = 422;
    error.data = modifyError(errors);
    next(error);
    return;
  }

  const { email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      modifiedErrors.confirmPassword = {
        message: "Entered paswords do not match",
        value: confirmPassword,
      };

      res.status(401).json({
        reason: {
          ...modifiedErrors,
        },
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
    });
    const result = await user.save();

    res.status(201).json({
      message: "New user created successfully",
      userId: result._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { errors } = validationResult(req);
  const modifiedErrors = {};

  // error object possibly contains the errors which will be thrown
  // when validation check(s) inside ../routes/auth.js file fail(s)
  /**
   * ========= POSSIBLE ERRORS =========
   * 1) Email has not been registered yet
   * 2) Entered email is invalid
   * 3) Entered password is invalid
   */
  if (errors.length > 0) {
    const error = new Error();
    error.statusCode = 422;
    error.data = modifyError(errors);
    next(error);
    return;
  }

  const { email, password } = req.body;
  let isPasswordCorrect = false;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      modifiedErrors.email = {
        message: "A user with this email could not be found",
        value: email,
      };
    } else {
      isPasswordCorrect = await bcrypt.compare(password, user.password);
    }

    if (!isPasswordCorrect) {
      modifiedErrors.password = {
        message: "Entered password is incorrect",
        value: password,
      };
    }

    if (Object.keys(modifiedErrors).length) {
      res.status(401).json({
        reason: {
          ...modifiedErrors,
        },
      });
      return;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login operation is successful",
      token,
      userId: user._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};
