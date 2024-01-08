const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");

const protect = asyncHandler(async (request, response, next) => {
  let token;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token from header
      token = request.headers.authorization.split(" ")[1];

      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from the token
      request.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      response.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    response.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
