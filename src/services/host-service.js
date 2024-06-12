const prisma = require("../models/prisma");

const hostService = {};

hostService.createTournament = async (tournamentData) => {
  // console.log(tournamentData);
  return await prisma.host.create({
    data: tournamentData,
  });
};

hostService.getTournamentById = async (id) => {
  return await prisma.host.findUnique({
    where: { id: parseInt(id) },
  });
};

hostService.getAllTournaments = async () => {
  return await prisma.host.findMany();
};

module.exports = hostService;
