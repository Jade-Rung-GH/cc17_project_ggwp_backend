const hashService = require("../services/hash-service");
const jwtService = require("../services/jwt-service");
const userService = require("../services/user-service");
const bcrypt = require("bcryptjs");
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

authController.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userService.updateUserPassword(userId, hashedPassword);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

authController.changeEmail = async (req, res, next) => {
  try {
    const { password, newEmail } = req.body;
    const userId = req.user.id;

    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    await userService.updateUserEmail(userId, newEmail);

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.error("Error changing email:", error);
    next(error);
  }
};

authController.changePhoneNumber = async (req, res, next) => {
  try {
    const { password, newPhoneNumber } = req.body;
    const userId = req.user.id;

    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    await userService.updateUserPhoneNumber(userId, newPhoneNumber);

    res.status(200).json({ message: "Phone number updated successfully" });
  } catch (error) {
    console.error("Error changing phone number:", error);
    next(error);
  }
};

module.exports = authController;
