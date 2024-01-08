const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");

//@desc     Register a new user
//@route    POST api/users/
//@access   Public
const registerUser = asyncHandler(async (request, response) => {
  const { name, email, password } = request.body;
  if (!name || !email || !password) {
    response.status(400);
    throw new Error("Please add all the fields");
  }

  //Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    response.status(400);
    throw new Error("User already exists");
  }

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    response.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    response.status(400);
    throw new Error("Invaid user data");
  }
});

//@desc     Authenticate a user
//@route    POST api/users/login
//@access   Public
const loginUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    response.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    response.status(400);
    throw new Error("Invalid Email or Password");
  }
});

//@desc     GET user data
//@route    POST api/users/me
//@access   Private
const getMe = asyncHandler(async (request, response) => {
  const { _id, name, email } = await User.findById(request.user.id);
  response.status(201).json({
    id: _id,
    name,
    email, 
  });
});

//Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = { registerUser, loginUser, getMe };
