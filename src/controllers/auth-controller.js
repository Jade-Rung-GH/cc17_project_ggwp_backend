const hashService = require("../services/hash-service");
const jwtService = require("../services/jwt-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");

const authController = {};

authController.register = async (req, res, next) => {
  try {
    console.log(req.body);
    // req.input password
    const data = req.input;
    const existUser = await userService.findUserByUsername(data.username);
    if (existUser) {
      createError({
        message: "Username is already in used",
        field: "username",
        statusCode: 400,
      });
    }

    // console.log(data);
    data.password = await hashService.hash(data.password);
    await userService.createUser(data);
    res.status(201).json({ message: "User Created" });
  } catch (err) {
    next(err);
  }
};

authController.login = async (req, res, next) => {
  try {
    const existUser = await userService.findUserByUsername(req.input.username);

    if (!existUser) {
      createError({
        message: "Invalid Credentials",
        statusCode: 400,
      });
    }

    const isMatch = await hashService.compare(
      req.input.password,
      existUser.password
    );

    if (!isMatch) {
      createError({
        message: "Invalid Credentials",
        statusCode: 400,
      });
    }

    const accessToken = jwtService.sign({ id: existUser.id });
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

authController.getMe = (req, res, next) => {
  res.status(200).json({ user: req.user });
};

module.exports = authController;
