const express = require("express");
const platformRouter = express.Router();
const platformController = require("../controllers/platform-controller");

platformRouter.get("/platforms/:id", platformController.getPlatformWithGames);

module.exports = platformRouter;
