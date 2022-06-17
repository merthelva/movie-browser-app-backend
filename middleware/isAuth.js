const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorizationHeaderValue = req.get("Authorization");
  if (!authorizationHeaderValue) {
    const error = new Error(
      "Authorization header is not attached to the request!"
    );
    error.statusCode = 401;
    throw error;
  }

  const token = authorizationHeaderValue.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error("Verification of token is failed");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
