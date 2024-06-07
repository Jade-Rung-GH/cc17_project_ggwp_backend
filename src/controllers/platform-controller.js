const platformService = require("../services/platform-service");

const getPlatformWithGames = async (req, res) => {
  const platformId = parseInt(req.params.id);

  try {
    const platformWithGames = await platformService.getPlatformWithGames(
      platformId
    );
    res.json(platformWithGames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPlatformWithGames,
};
