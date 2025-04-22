const Game = require("../models/gameModel");
const GameHistory = require("../models/gameHistoryModel");

// Generate a random room code

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // Generates a random 6-character string
};

// Create a new game room
const createRoom = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Deactivate existing active rooms for this user
    const existingRooms = await Game.find({
      $or: [
        { adminUsername: username, isGameActive: true },
        { "players.username": username, isGameActive: true },
      ],
    });

    if (existingRooms.length > 0) {
      await Promise.all(
        existingRooms.map((room) => {
          room.isGameActive = false;
          return room.save();
        })
      );
    }

    // Generate a unique room code with retries
    let roomId = null;
    const maxRetries = 5;
    let retryCount = 0;
    let isUnique = false;

    while (!isUnique && retryCount < maxRetries) {
      const generatedRoomId = generateRoomCode();
      // console.log(generatedRoomId);
      const existingRoom = await Game.findOne({ roomId: generatedRoomId });
      // console.log(existingRoom, generatedRoomId);

      if (!existingRoom) {
        roomId = generatedRoomId;
        isUnique = true;
        // console.log("Unique Room ID generated:", roomId);
      } else {
        retryCount++;
      }
    }

    // Handle room code generation failure
    if (!roomId || retryCount === maxRetries) {
      return res.status(500).json({
        message: "Unable to generate unique room code after multiple attempts.",
      });
    }

    // Create new game with the generated roomId
    const game = new Game({
      roomId,
      adminUsername: username,
      players: [
        {
          username,
          progress: 0,
          wpm: 0,
          accuracy: 0,
          isReady: false,
        },
      ],
    });

    await game.save();
    res.status(201).json({ roomId, game });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Start game
const startGame = async (req, res) => {
  try {
    const { roomId, username } = req.body;

    const game = await Game.findOne({ roomId, isGameActive: true });

    if (!game) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the user is the admin
    if (game.adminUsername !== username) {
      return res
        .status(403)
        .json({ message: "Only the room admin can start the game" });
    }

    // Check if there are at least 2 players
    if (game.players.length < 2) {
      return res
        .status(400)
        .json({ message: "Need at least 2 players to start" });
    }

    game.gameStarted = true;
    await game.save();

    res.status(200).json({ game });
  } catch (error) {
    console.error("Start game error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Join an existing room
const joinRoom = async (req, res) => {
  try {
    const { roomId, username } = req.body;

    if (!roomId || !username) {
      return res
        .status(400)
        .json({ message: "Room ID and username are required" });
    }

    // First, find and deactivate any existing active rooms for this user
    const existingRooms = await Game.find({
      $or: [
        { adminUsername: username, isGameActive: true },
        { "players.username": username, isGameActive: true },
      ],
    });

    // Deactivate all existing rooms for this user
    if (existingRooms.length > 0) {
      await Promise.all(
        existingRooms.map((room) => {
          room.isGameActive = false;
          return room.save();
        })
      );
    }

    const game = await Game.findOne({ roomId, isGameActive: true });
    if (!game) {
      return res
        .status(404)
        .json({ message: "Room not found or game already ended" });
    }

    // Check if player already exists in this room
    const playerExists = game.players.some(
      (player) => player.username === username
    );
    if (playerExists) {
      return res.status(400).json({ message: "Player already in room" });
    }

    // Add new player
    game.players.push({
      username,
      progress: 0,
      wpm: 0,
      accuracy: 0,
      isReady: false,
    });

    await game.save();
    res.status(200).json({ game });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get room details
const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const game = await Game.findOne({ roomId, isGameActive: true });

    if (!game) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ game });
  } catch (error) {
    console.error("Get room details error:", error);
    res.status(500).json({ message: error.message });
  }
};

// End game and save results
const endGame = async (req, res) => {
  try {
    const { roomId, stats } = req.body;

    const game = await Game.findOne({ roomId });
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Update player's stats in the game
    const playerIndex = game.players.findIndex(
      (p) => p.username === stats.username
    );
    if (playerIndex !== -1) {
      game.players[playerIndex].wpm = stats.wpm;
      game.players[playerIndex].accuracy = stats.accuracy;
      game.players[playerIndex].progress = 100; // Mark as completed
    }

    // Check if all players have completed
    const allPlayersCompleted = game.players.every(
      (player) => player.progress === 100
    );

    // Sort players by giving more weight to accuracy and less to WPM
    const sortedPlayers = [...game.players].sort((a, b) => {
      const scoreA = Math.pow(a.accuracy / 100, 2) * a.wpm; // Square the accuracy instead of the 4th power
      const scoreB = Math.pow(b.accuracy / 100, 2) * b.wpm; // Square the accuracy instead of the 4th power

      // console.log(`ScoreA: ${scoreA}, ScoreB: ${scoreB}`); // Check the computed scores
      return scoreB - scoreA; // Sort in descending order (higher score wins)
    });

    const winner = sortedPlayers[0];

    game.winner = {
      username: winner.username,
      wpm: winner.wpm,
      accuracy: winner.accuracy,
    };
    console.log("winner", winner);

    // Create game history record
    const gameHistory = new GameHistory({
      roomId,
      players: sortedPlayers.map((player, index) => ({
        username: player.username,
        wpm: player.wpm || 0,
        accuracy: player.accuracy || 0,
        position: index + 1,
      })),
      winner: {
        username: winner.username,
        wpm: winner.wpm || 0,
        accuracy: winner.accuracy || 0,
      },
    });

    await gameHistory.save();

    // Only mark game as inactive if all players have completed or if admin ends the game
    if (allPlayersCompleted) {
      game.isGameActive = false;
    }

    await game.save();

    res.status(200).json({ game, isGameEnded: !game.isGameActive });
  } catch (error) {
    console.error("End game error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user game history
const getUserGameHistory = async (req, res) => {
  try {
    const { username } = req.params;

    const gameHistory = await GameHistory.find({
      "players.username": username,
    }).sort({ date: -1 }); // Sort by most recent first

    // Calculate statistics
    const stats = {
      totalGames: gameHistory.length,
      wins: gameHistory.filter((game) => game.winner.username === username)
        .length,
      averageWPM: 0,
      averageAccuracy: 0,
      bestWPM: 0,
    };

    if (gameHistory.length > 0) {
      const userGames = gameHistory.map((game) =>
        game.players.find((player) => player.username === username)
      );

      stats.averageWPM = Math.round(
        userGames.reduce((sum, game) => sum + game.wpm, 0) / userGames.length
      );
      stats.averageAccuracy = Math.round(
        userGames.reduce((sum, game) => sum + game.accuracy, 0) /
          userGames.length
      );
      stats.bestWPM = Math.max(...userGames.map((game) => game.wpm));
    }

    res.status(200).json({ gameHistory, stats });
  } catch (error) {
    console.error("Get game history error:", error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createRoom,
  joinRoom,
  getRoomDetails,
  startGame,
  endGame,
  getUserGameHistory,
};
