import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineCreate } from "react-icons/md";
import { SquarePlus, Users, Copy, Play } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, getProfile } from '../store/Slice/profileSlice';
import axios from 'axios';
import { io } from 'socket.io-client';
import TypingArea from '../components/Game/TypingArea';
import GameResultsModal from '../components/Game/GameResultsModal';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const sharedClass = "bg-lightBackground dark:bg-darkBackground hover:bg-darkBackground dark:hover:bg-lightBackground text-darkBackground hover:text-lightBackground dark:text-lightBackground hover:dark:text-darkBackground border-2 border-darkBackground dark:border-lightBackground transition-colors duration-300";

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog with five dozen liquor jugs",
  "Pack my box with five dozen liquor jugs that quickly faxed wine labels",
  "How vexingly quick daft zebras jump when boxing mixed up flags"
];

function Room() {
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const { profile } = useSelector(getProfile);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerProgress, setPlayerProgress] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [gameText, setGameText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [gameResults, setGameResults] = useState(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const dispatch = useDispatch();
  // Initialize Socket.IO connection

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    dispatch(fetchProfile());
    return () => newSocket.close();
  }, []);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    // console.log(profile);
    socket.on('playerProgress', ({ username, progress, wpm, accuracy }) => {
      setPlayerProgress(prev => ({
        ...prev,
        [username]: { progress, wpm, accuracy }
      }));
    });

    socket.on('gameEnded', (results) => {
      setGameResults(results);
      setShowResults(true);
      setGameStarted(false);
    });

    return () => {
      socket.off('playerProgress');
      socket.off('gameEnded');
    };
  }, [socket]);


  // set admin
  useEffect(() => {
    if (roomCode && players.length > 0) {
      // const adminPlayer = players.find(p => p.username === profile.username);
      setIsAdmin(profile.username === players[0].username);
    }
  }, [roomCode, players, profile]);

  const createRoom = async () => {
    try {
      const token = localStorage.getItem('typeToken');
      const response = await axios.post('http://localhost:3000/api/game/create',
        { username: profile.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log(response);
      setRoomCode(response.data.roomId);
      setPlayers(response.data.game.players);
      socket.emit('joinRoom', response.data.roomId);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating room');
    }
  };

  const joinRoom = async () => {
    try {
      const token = localStorage.getItem('typeToken');
      const response = await axios.post('http://localhost:3000/api/game/join',
        { roomId: joinCode, username: profile.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRoomCode(joinCode);
      setPlayers(response.data.game.players);
      socket.emit('joinRoom', joinCode);
    } catch (error) {
      setError(error.response?.data?.message || 'Error joining room');
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  useEffect(() => {
    if (roomCode && !hasCompleted) { // Only call this when game is active
      const interval = setInterval(async () => {
        try {
          const token = localStorage.getItem('typeToken');
          const response = await axios.get(`http://localhost:3000/api/game/room/${roomCode}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPlayers(response.data.game.players);
        } catch (error) {
          console.error('Error fetching room details:', error);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [roomCode, hasCompleted]); // Include gameStarted in the dependency array



  const startGame = async () => {
    try {
      const token = localStorage.getItem('typeToken');
      await axios.post('http://localhost:3000/api/game/start',
        {
          roomId: roomCode,
          username: profile.username
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Set random text for the game
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      setGameText(randomText);
      setGameStarted(true);

      // Emit socket event to notify other players with the game text
      socket.emit('gameStarted', { roomId: roomCode, gameText: randomText });
    } catch (error) {
      setError(error.response?.data?.message || 'Error starting game');
    }
  };

  // Update socket event listener for game start
  useEffect(() => {
    if (!socket) return;

    socket.on('gameStarted', (data) => {
      setGameStarted(true);
      setGameText(data.gameText);
    });

    return () => {
      socket.off('gameStarted');
    };
  }, [socket]);



  const handleProgress = (progress, wpm, accuracy) => {
    if (socket && roomCode) {
      socket.emit('updateProgress', {
        roomId: roomCode,
        username: profile.username,
        progress,
        wpm,
        accuracy
      });
    }
  };

  const handleGameComplete = async (stats) => {
    try {
      if (hasCompleted) return; // Prevent multiple submissions

      setHasCompleted(true);
      const token = localStorage.getItem('typeToken');
      const response = await axios.post('http://localhost:3000/api/game/end',
        {
          roomId: roomCode,
          stats: {
            ...stats,
            username: profile.username
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Only emit game ended if the game is actually ended
      if (response.data.isGameEnded) {
        socket.emit('gameEnded', { roomId: roomCode, results: response.data.game });
        setGameResults(response.data.game);
        // console.log('room',response.data.game);
        setShowResults(true);
        setGameStarted(false);
      } else {
        // If game hasn't ended, just update progress
        socket.emit('updateProgress', {
          roomId: roomCode,
          username: profile.username,
          progress: 100,
          wpm: stats.wpm,
          accuracy: stats.accuracy
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error ending game');
    }
  };



  const renderPlayerProgress = (player) => {
    const progress = playerProgress[player.username]?.progress || 0;
    const wpm = playerProgress[player.username]?.wpm || 0;
    const accuracy = playerProgress[player.username]?.accuracy || 0;

    return (
      <li
        key={player.username}
        className="mb-4 p-4 border rounded-lg bg-opacity-50 backdrop-blur-sm"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-darkBackground dark:text-lightBackground">
            {player.username}
          </span>
          <div className="text-sm">
            <span className="mr-4">WPM: {wpm}</span>
            <span>Accuracy: {accuracy}%</span>
          </div>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </li>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-8 bg-lightBackground dark:bg-darkBackground"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.h1
          {...fadeIn}
          className="text-3xl md:text-4xl font-bold text-center text-darkBackground dark:text-lightBackground"
        >
          Multiplayer Room
        </motion.h1>


        <>
          {error && (
            <div className="text-red-500 text-center">
              {error}
            </div>
          )}

          {!roomCode ? (
            <motion.div
              {...fadeIn}
              className="flex flex-col space-y-4"
            >
              <button
                onClick={createRoom}
                className={`px-6 py-4 text-center text-lg font-medium ${sharedClass} flex items-center justify-center`}
              >
                Create Room
                <MdOutlineCreate className="ml-2" size={24} />
              </button>

              {!showJoinInput ? (
                <button
                  onClick={() => setShowJoinInput(true)}
                  className={`px-6 py-4 text-center text-lg font-medium ${sharedClass} flex items-center justify-center`}
                >
                  Join Room
                  <SquarePlus className="ml-2" size={24} />
                </button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="Enter Room Code"
                    className="px-4 py-2 border rounded text-darkBackground"
                    maxLength={6}
                  />
                  <button
                    onClick={joinRoom}
                    className={`px-6 py-2 text-center text-lg font-medium ${sharedClass}`}
                  >
                    Join
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              {...fadeIn}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-darkBackground dark:text-lightBackground">
                    Room Code: {roomCode}
                  </span>
                  <button
                    onClick={copyRoomCode}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Copy size={20} />
                  </button>
                </div>
                {!gameStarted && isAdmin && players.length > 1 && (
                  <button
                    onClick={startGame}
                    className={`px-4 py-2 rounded-lg ${sharedClass}`}
                  >
                    Start Game <Play className="inline-block ml-2" size={20} />
                  </button>
                )}
              </div>

              <div className="border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Users className="mr-2" />
                  <h3 className="text-lg font-semibold text-darkBackground dark:text-lightBackground">
                    Players ({players.length})
                  </h3>
                </div>
                <ul className="space-y-4">
                  {players.map(player => renderPlayerProgress(player))}
                </ul>
              </div>

              {gameStarted && gameText && !hasCompleted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <TypingArea
                    text={gameText}
                    timeLimit={120}
                    onProgress={handleProgress}
                    onTimeUp={handleGameComplete}
                  />
                </motion.div>
              )}

              {hasCompleted && !showResults && (
                <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                  <p className="text-lg font-semibold">
                    You've completed the game! Waiting for other players...
                  </p>
                </div>
              )}
            </motion.div>
          )}

          <motion.div
            {...fadeIn}
            className="text-center"
          >
            <Link
              to="/"
              className="text-darkBackground dark:text-lightBackground hover:underline"
            >
              Back to Home
            </Link>
          </motion.div>
        </>

      </div>

      {showResults && gameResults && (
        <GameResultsModal
          results={gameResults}
          onClose={() => navigate('/')}
        />
      )}
    </motion.div>
  );
}

export default Room; 