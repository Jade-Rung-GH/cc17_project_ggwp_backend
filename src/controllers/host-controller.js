const tournamentService = require("../services/host-service");

const hostController = {};

hostController.hostTournament = async (req, res, next) => {
  try {
    // console.log(req.body);
    const tournament = await tournamentService.createTournament(req.body);
    // console.log("***********************");
    res.status(201).json(tournament);
  } catch (error) {
    next(error);
  }
};

hostController.getTournament = async (req, res, next) => {
  const { id } = req.params;

  try {
    const tournament = await tournamentService.getTournamentById(id);
    if (tournament) {
      res.json(tournament);
    } else {
      res.status(404).json({ error: "Tournament not found" });
    }
  } catch (error) {
    // res.status(400).json({ error: error.message });
    next(error);
  }
};

hostController.getTournamentsByUserId = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tournaments = await tournamentService.getTournamentsByUserId(userId);
    res.json(tournaments);
  } catch (error) {
    // res.status(400).json({ error: error.message });
    next(error);
  }
};

hostController.getHostedTournaments = async (req, res, next) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();
    res.json(tournaments);
  } catch (error) {
    // res.status(400).json({ error: error.message });
    next(error);
  }
};

hostController.updateTournament = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updateData = req.body;
  console.log(req.params);
  console.log(id);

  try {
    await tournamentService.updateTournament(+id, +userId, updateData);
    res.status(200).json({ message: "Tournament updated successfully!" });
  } catch (error) {
    // res.status(400).json({ error: error.message });
    next(error);
  }
};

hostController.deleteTournament = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await tournamentService.deleteTournament(id, userId);
    res.status(200).json({ message: "Tournament deleted successfully!" });
  } catch (error) {
    // res.status(400).json({ error: error.message });
    next(error);
  }
};

module.exports = hostController;
