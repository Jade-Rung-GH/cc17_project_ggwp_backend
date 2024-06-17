const express = require("express");
const hostController = require("../controllers/host-controller");
const authenticate = require("../middlewares/authenticate");

const hostRouter = express.Router();

hostRouter.post("/", hostController.hostTournament);
hostRouter.get("/tournaments/:id", hostController.getTournament);

hostRouter.get(
  "/user/tournaments",
  authenticate,
  hostController.getTournamentsByUserId
);
hostRouter.get("/tournaments/", hostController.getHostedTournaments);

hostRouter.patch(
  "/tournaments/:id",
  authenticate,
  hostController.updateTournament
);
hostRouter.delete(
  "/tournaments/:id",
  authenticate,
  hostController.deleteTournament
);

module.exports = hostRouter;
