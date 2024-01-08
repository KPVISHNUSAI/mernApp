const asyncHandler = require("express-async-handler");

const Goal = require("../model/goalModel");
const User = require("../model/userModel");

//@desc     GET goals
//@route    api/goals
//@access   private
const getGoals = asyncHandler(async (request, response) => {
  const goals = await Goal.find({ user: request.user.id });
  response.status(200).json(goals);
});

//@desc     POST goal
//@route    api/goals
//@access   private
const setGoals = asyncHandler(async (request, response) => {
  if (!request.body.text) {
    response.status(400);
    throw new Error("Please add a text");
  }
  const goal = await Goal.create({
    text: request.body.text,
    user: request.user.id,
  });

  console.log(request.body);
  response.status(200).json(goal);
});

//@desc     PUT goals
//@route    api/goals
//@access   private
const updateGoal = asyncHandler(async (request, response) => {
  const goal = await Goal.findById(request.params.id);

  if (!goal) {
    response.status(400);
    throw new Error("Goal not found");
  }

  const user = await User.findById(request.user.id);

  //check for user
  if (!user) {
    response.status(401);
    throw new Error("user not found");
  }
  //Make sure the logged in user matches the goal user
  if (goal.user.toString() !== user.id) {
    response.status(401);
    throw new Error("User not Authorized");
  }

  const updatedGoal = await Goal.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
      new: true,
    }
  );

  response.status(200).json(updatedGoal);
});

//@desc     DELETE goals
//@route    api/goals
//@access   private
const deleteGoal = asyncHandler(async (request, response) => {
  const goal = await Goal.findById(request.params.id);

  if (!goal) {
    response.status(400);
    throw new Error("Goal not found");
  }

  const user = await User.findById(request.user.id);

  //check for user
  if (!user) {
    response.status(401);
    throw new Error("user not found");
  }
  //Make sure the logged in user matches the goal user
  if (goal.user.toString() !== user.id) {
    response.status(401);
    throw new Error("User not Authorized");
  }

  await Goal.findByIdAndDelete(request.params.id);

  response.status(200).json({ id: request.params.id });
});

module.exports = {
  getGoals,
  setGoals,
  updateGoal,
  deleteGoal,
};
