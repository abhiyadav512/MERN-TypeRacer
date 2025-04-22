const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
// const morgan = require("morgan");
const connectDB = require("./db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: "http://localhost:5173",
    origin: ["http://localhost:3000", "https://mern-type-racer.vercel.app"],
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
// app.use(cors({ origin: "http://localhost:5173" })); // Replace with your frontend URL
app.use(cors({ origin: "https://mern-type-racer.vercel.app" })); // Replace with your frontend URL

// Passport Initialization
app.use(passport.initialize());
require("./config/passport");

// app.use(cors());
// app.use(morgan("dev"));

// Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("gameStarted", ({ roomId, gameText }) => {
    io.to(roomId).emit("gameStarted", { gameText });
  });

  socket.on("updateProgress", ({ roomId, username, progress, wpm, accuracy }) => {
    io.to(roomId).emit("playerProgress", { username, progress, wpm, accuracy });
  });

  socket.on("gameEnded", ({ roomId, results }) => {
    io.to(roomId).emit("gameEnded", results);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
