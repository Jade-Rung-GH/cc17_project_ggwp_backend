const express = require("express");
const hostController = require("../controllers/host-controller");

const hostRouter = express.Router();

hostRouter.post("/", hostController.hostTournament);
hostRouter.get("/tournaments/:id", hostController.getTournament);
hostRouter.get("/tournaments/", hostController.getHostedTournaments);

module.exports = hostRouter;
