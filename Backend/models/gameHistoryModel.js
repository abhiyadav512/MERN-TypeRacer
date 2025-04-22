const mongoose = require("mongoose");

const gameHistorySchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  players: [
    {
      username: { type: String, required: true },
      wpm: { type: Number, required: true },
      accuracy: { type: Number, required: true },
      position: { type: Number, required: true }, // Final position (1st, 2nd, etc.)
    },
  ],
  winner: {
    username: { type: String, required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GameHistory", gameHistorySchema); 