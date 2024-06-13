const tournamentService = require("../services/host-service");

exports.hostTournament = async (req, res) => {
  try {
    const tournament = await tournamentService.createTournament(req.body);
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTournament = async (req, res, next) => {
  const { id } = req.params;

  try {
    const tournament = await tournamentService.getTournamentById(id);
    if (tournament) {
      res.json(tournament);
    } else {
      res.status(404).json({ error: "Tournament not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getHostedTournaments = async (req, res, next) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();
    res.json(tournaments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
