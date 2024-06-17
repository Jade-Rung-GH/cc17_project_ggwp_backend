const prisma = require("../models/prisma");

const userService = {};

userService.createUser = (data) => prisma.user.create({ data });

userService.findUserByUsername = (username) =>
  prisma.user.findFirst({
    where: { username: username },
  });

userService.findUserById = (userId) =>
  prisma.user.findUnique({ where: { id: userId } });

userService.updateUserById = (data, userId) =>
  prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });

userService.updateUserPassword = (userId, newPassword) =>
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  });

userService.updateUserEmail = (userId, newEmail) =>
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email: newEmail,
    },
  });

userService.updateUserPhoneNumber = (userId, newPhoneNumber) =>
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      phone: newPhoneNumber,
    },
  });

module.exports = userService;
