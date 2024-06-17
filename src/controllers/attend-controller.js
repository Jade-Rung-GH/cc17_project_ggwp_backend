const attendService = require("../services/attend-service");

const attendController = {};

attendController.attendTournament = async (req, res, next) => {
  const { tourId, teamMembers } = req.body;
  const userId = req.user.id;

  try {
    // Fetch the tournament to get the hostId
    const host = await attendService.getHostByTourId(parseInt(tourId));

    if (host.hostId === userId) {
      return res
        .status(403)
        .json({ error: "You cannot join your own tournament." });
    }

    await attendService.attendTournament(parseInt(tourId), userId, teamMembers);
    res.status(200).json({ message: "Successfully joined the tournament!" });
  } catch (error) {
    console.error("Error in attendTournament controller:", error); // Add logging
    res.status(400).json({ error: error.message });
  }
};

attendController.getAttendedTournaments = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const attendedTournaments = await attendService.getAttendedTournaments(
      userId
    );
    res.json(attendedTournaments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

attendController.deleteAttendance = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await attendService.deleteAttendance(id, userId);
    res.status(200).json({ message: "Attendance deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = attendController;
