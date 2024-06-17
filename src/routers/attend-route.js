const express = require("express");
const attendController = require("../controllers/attend-controller");
const authenticate = require("../middlewares/authenticate");

const attendRouter = express.Router();

attendRouter.post("/", authenticate, attendController.attendTournament);
attendRouter.get(
  "/attended-tournaments",
  authenticate,
  attendController.getAttendedTournaments
);
attendRouter.delete(
  "/attended-tournaments/:id",
  authenticate,
  attendController.deleteAttendance
);

module.exports = attendRouter;
