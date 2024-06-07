const prisma = require("../models/prisma");

const getPlatformWithGames = async (platformId) => {
  try {
    const platformWithGames = await prisma.platform.findUnique({
      where: { id: platformId },
      include: {
        platformLink: {
          include: {
            games: true,
          },
        },
      },
    });

    if (!platformWithGames) {
      throw new Error("Platform not found");
    }

    return platformWithGames;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

module.exports = { getPlatformWithGames };
