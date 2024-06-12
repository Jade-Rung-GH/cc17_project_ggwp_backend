const tournamentService = require("../services/host-service");

exports.hostTournament = async (req, res, next) => {
  const {
    platformWithGameId,
    teamOrNot,
    teamAmount,
    teamLimit,
    prizePool,
    addressOrOnline,
    rules,
    tourPassword,
    startTour,
    endTour,
    registrationStartDate,
    registrationEndDate,
    hostId,
  } = req.body;

  try {
    const tournament = await tournamentService.createTournament({
      platformWithGameId,
      teamOrNot,
      teamAmount,
      teamLimit,
      prizePool,
      addressOrOnline,
      rules,
      tourPassword,
      startTour: new Date(startTour),
      endTour: new Date(endTour),
      registrationStartDate: new Date(registrationStartDate),
      registrationEndDate: new Date(registrationEndDate),
      hostId,
    });
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
