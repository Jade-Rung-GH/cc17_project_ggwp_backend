const prisma = require("../models/prisma");

const hostService = {};

hostService.createTournament = async (data) => {
  const {
    platform,
    game,
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
  } = data;

  const platformRecord = await prisma.platform.findFirst({
    where: { platformName: platform },
  });
  if (!platformRecord) {
    platformRecord = await prisma.platform.create({
      data: { platformName: platform },
    });
  }

  const gameRecord = await prisma.games.findFirst({
    where: { gameName: game },
  });
  if (!gameRecord) {
    gameRecord = await prisma.games.create({
      data: { gameName: game },
    });
  }

  const platformWithGameRecord = await prisma.platformWithGames.findFirst({
    where: { platformId: platformRecord.id, gameId: gameRecord.id },
  });
  if (!platformWithGameRecord) {
    platformWithGameRecord = await prisma.platformWithGames.create({
      data: {
        platformId: platformRecord.id,
        gameId: gameRecord.id,
      },
    });
  }

  const tournament = await prisma.host.create({
    data: {
      platformWithGameId: platformWithGameRecord.id,
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
    },
  });

  return tournament;
};

hostService.getTournamentById = async (id) => {
  return await prisma.host.findUnique({
    where: { id: parseInt(id) },
  });
};

hostService.getAllTournaments = async () => {
  const tournamentList = await prisma.host.findMany({
    include: {
      platformWithGame: {
        include: {
          games: true,
          platform: true,
        },
      },
      user: true,
    },
  });
  return tournamentList.map((item) => {
    return {
      username: item.user.username,
      games: item.platformWithGame.games,
      platform: item.platformWithGame.platform,
      id: item.id,
      teamLimit: item.teamLimit,
      teamAmount: item.teamAmount,
      prizePool: item.prizePool,
      addressOrOnline: item.addressOrOnline,
      rules: item.rules,
      tourPassword: item.tourPassword,
      startTour: item.startTour,
      endTour: item.endTour,
      registrationStartDate: item.registrationStartDate,
      registrationEndDate: item.registrationEndDate,
    };
  });
};

module.exports = hostService;
