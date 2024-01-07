const asyncHandler = require("express-async-handler");

//@desc     GET goals
//@route    api/goals
//@access   private
const getGoals = asyncHandler(async (request, response) => {
  response.status(200).json({ message: "Get goals" });
});

//@desc     POST goal
//@route    api/goals
//@access   private
const setGoals = asyncHandler(async (request, response) => {
  if (!request.body.text) {
    response.status(400);
    throw new Error("Please add a text");
  }
  console.log(request.body);
  response.status(200).json({ message: "Set goal" });
});

//@desc     PUT goals
//@route    api/goals
//@access   private
const updateGoal = asyncHandler(async (request, response) => {
  response.status(200).json({ message: `Updated goal ${request.params.id}` });
});

//@desc     DELETE goals
//@route    api/goals
//@access   private
const deleteGoal = asyncHandler(async (request, response) => {
  response.status(200).json({ message: `Deleted goal ${request.params.id}` });
});

module.exports = {
  getGoals,
  setGoals,
  updateGoal,
  deleteGoal,
};
