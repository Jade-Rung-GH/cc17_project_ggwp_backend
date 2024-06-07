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

module.exports = userService;