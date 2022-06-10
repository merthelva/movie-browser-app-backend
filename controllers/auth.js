const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const modifyError = require("../utilties/modifyError");

exports.signup = async (req, res, next) => {
  const { errors } = validationResult(req);

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
      res.status(401).json({
        reason: [
          {
            confirmPassword: {
              message: "Entered paswords do not match",
              value: confirmPassword,
            },
          },
        ],
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
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({
        reason: [
          {
            email: {
              message: "A user with this email could not be found",
              value: email,
            },
          },
        ],
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({
        reason: [
          {
            password: {
              message: "Entered password is incorrect",
              value: password,
            },
          },
        ],
      });
      return;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersuperlongsecret",
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
