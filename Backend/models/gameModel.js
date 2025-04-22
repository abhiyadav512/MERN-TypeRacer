const mongoose = require("mongoose");

// Define Game Schema
const gameSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  adminUsername: {
    type: String,
    required: true,
  },
  players: [
    {
      username: { type: String, required: true },
      wpm: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      progress: { type: Number, default: 0 },
      isReady: { type: Boolean, default: false },
    },
  ],
  winner: {
    username: { type: String,  },
    wpm: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
  },
  isGameActive: { type: Boolean, default: true },
  gameStarted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // Automatically delete after 1 hour
});

// Add a pre-save middleware to ensure roomId is not null
gameSchema.pre("save", function (next) {
  if (!this.roomId) {
    next(new Error("Room ID is required"));
  }
  next();
});

module.exports = mongoose.model("Game", gameSchema);
