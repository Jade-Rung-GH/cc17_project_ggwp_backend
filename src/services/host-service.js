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
  const tournament = await prisma.host.findUnique({
    where: { id: parseInt(id) },
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

  if (tournament) {
    return {
      username: tournament.user.username,
      games: tournament.platformWithGame.games,
      platform: tournament.platformWithGame.platform,
      id: tournament.id,
      teamLimit: tournament.teamLimit,
      teamAmount: tournament.teamAmount,
      prizePool: tournament.prizePool,
      addressOrOnline: tournament.addressOrOnline,
      rules: tournament.rules,
      tourPassword: tournament.tourPassword,
      startTour: tournament.startTour,
      endTour: tournament.endTour,
      registrationStartDate: tournament.registrationStartDate,
      registrationEndDate: tournament.registrationEndDate,
    };
  }
  return null;
};

hostService.getTournamentsByUserId = async (userId) => {
  const tournamentList = await prisma.host.findMany({
    where: { hostId: userId },
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

hostService.updateTournament = async (id, userId, data) => {
  const tournament = await prisma.host.findUnique({
    where: { id: parseInt(id) },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  if (tournament.hostId !== userId) {
    throw new Error("You are not authorized to update this tournament");
  }

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
  } = data;

  let platformWithGameId;

  if (platform && game) {
    const platformRecord = await prisma.platform.findFirst({
      where: { platformName: platform },
    });

    const gameRecord = await prisma.games.findFirst({
      where: { gameName: game },
    });

    const platformWithGameRecord = await prisma.platformWithGames.findFirst({
      where: { platformId: platformRecord.id, gameId: gameRecord.id },
    });

    platformWithGameId = platformWithGameRecord.id;
  }

  const updatedData = {
    ...(platformWithGameId && { platformWithGameId }),
    ...(teamOrNot !== undefined && { teamOrNot }),
    ...(teamAmount !== undefined && { teamAmount }),
    ...(teamLimit !== undefined && { teamLimit }),
    ...(prizePool !== undefined && { prizePool }),
    ...(addressOrOnline !== undefined && { addressOrOnline }),
    ...(rules !== undefined && { rules }),
    ...(tourPassword !== undefined && { tourPassword }),
    ...(startTour !== undefined && { startTour: new Date(startTour) }),
    ...(endTour !== undefined && { endTour: new Date(endTour) }),
    ...(registrationStartDate !== undefined && {
      registrationStartDate: new Date(registrationStartDate),
    }),
    ...(registrationEndDate !== undefined && {
      registrationEndDate: new Date(registrationEndDate),
    }),
  };

  await prisma.host.update({
    where: { id: parseInt(id) },
    data: updatedData,
  });
};

hostService.deleteTournament = async (id, userId) => {
  const tournament = await prisma.host.findUnique({
    where: { id: parseInt(id) },
  });

  if (!tournament) {
    throw new Error("Tournament not found");
  }

  if (tournament.hostId !== userId) {
    throw new Error("You are not authorized to delete this tournament");
  }

  await prisma.host.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = hostService;
