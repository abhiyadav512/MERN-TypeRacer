const express = require('express');
const router = express.Router();
const { createRoom, joinRoom, getRoomDetails, startGame, endGame, getUserGameHistory } = require('../controllers/gameController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, createRoom);
router.post('/join', authMiddleware, joinRoom);
router.get('/room/:roomId', authMiddleware, getRoomDetails);
router.post('/start', authMiddleware, startGame);
router.post('/end', authMiddleware, endGame);
router.get('/history/:username', authMiddleware, getUserGameHistory);

module.exports = router;
