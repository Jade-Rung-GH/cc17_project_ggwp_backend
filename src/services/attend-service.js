const prisma = require("../models/prisma");

const attendService = {};

attendService.getHostByTourId = async (tourId) => {
  const host = await prisma.host.findUnique({
    where: { id: tourId },
  });

  if (!host) {
    throw new Error("Tournament not found");
  }

  return host;
};

attendService.attendTournament = async (tourId, userId, teamMembers) => {
  const host = await prisma.host.findUnique({
    where: { id: tourId },
  });

  if (!host) {
    throw new Error("Tournament not found");
  }

  let teamId;
  if (host.teamLimit === 1) {
    // Single player registration
    const team = await prisma.teamInformation.create({
      data: {
        teamLeadId: userId,
        playerNames: JSON.stringify([userId]), // Just the user
      },
    });
    teamId = team.id;
  } else {
    // Team registration
    const team = await prisma.teamInformation.create({
      data: {
        teamLeadId: userId,
        playerNames: JSON.stringify(teamMembers),
      },
    });
    teamId = team.id;
  }

  await prisma.attendingTour.create({
    data: {
      tourId,
      teamId: teamId,
    },
  });
};

attendService.getAttendedTournaments = async (userId) => {
  const attendedTournaments = await prisma.attendingTour.findMany({
    where: {
      teamsInfo: {
        userTeamLead: {
          id: userId,
        },
      },
    },
    include: {
      host: {
        include: {
          platformWithGame: {
            include: {
              games: true,
              platform: true,
            },
          },
          user: true,
        },
      },
      teamsInfo: true,
    },
  });

  return attendedTournaments.map((attended) => ({
    id: attended.id,
    tourId: attended.tourId,
    teamId: attended.teamId,
    username: attended.host.user.username,
    games: attended.host.platformWithGame.games,
    platform: attended.host.platformWithGame.platform,
    teamLimit: attended.host.teamLimit,
    teamAmount: attended.host.teamAmount,
    prizePool: attended.host.prizePool,
    addressOrOnline: attended.host.addressOrOnline,
    rules: attended.host.rules,
    tourPassword: attended.host.tourPassword,
    startTour: attended.host.startTour,
    endTour: attended.host.endTour,
    registrationStartDate: attended.host.registrationStartDate,
    registrationEndDate: attended.host.registrationEndDate,
  }));
};

attendService.deleteAttendance = async (attendId, userId) => {
  const attendance = await prisma.attendingTour.findUnique({
    where: { id: parseInt(attendId) },
    include: {
      teamsInfo: true,
    },
  });

  if (!attendance) {
    throw new Error("Attendance not found");
  }

  if (attendance.teamsInfo.teamLeadId !== userId) {
    throw new Error("You are not authorized to delete this attendance");
  }

  await prisma.attendingTour.delete({
    where: { id: parseInt(attendId) },
  });
};

module.exports = attendService;
