import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TypingArea from '../components/Game/TypingArea';
import axios from 'axios';
import { Timer, Type, Target, RotateCcw, Award, X } from 'lucide-react'; // Added X icon for close button
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import mainApi from '../api/mainApi';

const sampleTexts = [
    "The quick brown fox jumps over the lazy with five dozen liquor jugs thd sid",
    "Pack my box with five dozen liquor jugs thd with five dozen liquor jugs thd sid ...",
    "How vexingly quick daft zebras jump! with five dozen liquor jugs thd sid"
];


const TIME_OPTIONS = [
    { value: 30, label: '30 Seconds', icon: <Timer size={20} /> },
    { value: 60, label: '1 Minute', icon: <Timer size={20} /> },
    { value: 120, label: '2 Minutes', icon: <Timer size={20} /> },
    { value: 300, label: '5 Minutes', icon: <Timer size={20} /> }
];

const sharedClass = "bg-lightBackground dark:bg-darkBackground hover:bg-darkBackground dark:hover:bg-lightBackground text-darkBackground hover:text-lightBackground dark:text-lightBackground hover:dark:text-darkBackground border-2 border-darkBackground dark:border-lightBackground transition-colors duration-300";

const SinglePlayer = () => {
    const { width, height } = useWindowSize(); // Use for confetti size
    const [gameState, setGameState] = useState('waiting');
    const [gameText, setGameText] = useState('');
    const [stats, setStats] = useState({ wpm: 0, accuracy: 0, progress: 0 });
    const [selectedTime, setSelectedTime] = useState(60);
    const [gameStats, setGameStats] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    const handleStartGame = () => {
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        setGameText(randomText);
        setGameState('active');
    };

    const handleProgress = (progress, wpm, accuracy) => {
        setStats({ progress, wpm, accuracy });
    };

    const handleTimeUp = async (finalStats) => {
        setGameState('finished');
        setGameStats(finalStats);
        console.log(finalStats);
        try {
            await mainApi.post('/api/game/single-player', finalStats);
        } catch (err) {
            console.error('Failed to save the game result.', err);
        }
    };

    const handleRestart = () => {
        setGameState('waiting');
        setGameStats(null);
    };

    const handleClose = () => {
        navigate('/'); // Navigate to the home page
    };

    return (
        <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-darkBackground dark:text-lightBackground transition-colors duration-300 p-6">
            <motion.div
                className="max-w-4xl mx-auto space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header Section */}
                <motion.div
                    className="text-center space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-4">
                        Single-Player Challenge
                    </h1>
                </motion.div>

                {/* Game Setup Section */}
                {gameState === 'waiting' && (
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex flex-col items-center space-y-6">
                            <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 mb-4">
                                <Target size={24} />
                                Select Your Challenge Time
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                                {TIME_OPTIONS.map(option => (
                                    <motion.button
                                        key={option.value}
                                        className={`flex justify-center items-center gap-2 w-full py-4 text-center ${selectedTime === option.value ? 'bg-darkBackground text-lightBackground dark:bg-lightBackground dark:text-darkBackground' : sharedClass}`}
                                        onClick={() => setSelectedTime(option.value)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {option.icon}
                                        <span className="font-medium">{option.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            <motion.button
                                style={{ marginTop: '30px' }}
                                onClick={handleStartGame}
                                className={` px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center gap-2${sharedClass}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Type size={24} />
                                Start Typing Challenge
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Active Game Section */}
                {gameState === 'active' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6`}
                    >
                        <TypingArea
                            text={gameText}
                            timeLimit={selectedTime}
                            onProgress={handleProgress}
                            onTimeUp={handleTimeUp}
                        />
                    </motion.div>
                )}

                {/* Results Section */}
                {gameState === 'finished' && gameStats && (
                    <motion.div
                        className="fixed -top-10 inset-0 bg-black  bg-opacity-50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Confetti width={width} height={height} />

                        <div className="relative  bg-lightBackground dark:bg-darkBackground p-6 sm:p-8  shadow-2xl text-lightText dark:text-darkText">
                            {/* Confetti Effect */}


                            <div className="text-center space-y-4">
                                {/* Close Button */}
                                <button
                                    className="absolute top-4 right-4 text-darkBackground dark:text-lightBackground hover:text-red-600"
                                    onClick={handleClose}
                                >
                                    <X size={24} />
                                </button>

                                {/* Winning Icon */}
                                <Award className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-yellow-500 dark:text-yellow-300 animate-bounce" />

                                {/* Winner Text */}
                                <h2 className="text-3xl py-1 sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text animate-pulse">
                                    Challenge Complete!
                                </h2>
                            </div>

                            {/* Stats Section */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                                {[
                                    { label: 'WPM', value: gameStats.wpm },
                                    { label: 'Accuracy', value: `${gameStats.accuracy}%` },
                                    { label: 'Characters', value: gameStats.charsTyped },
                                    { label: 'Correct Chars', value: gameStats.correctChars },
                                    { label: 'Mistakes', value: gameStats.mistakes.length },
                                    { label: 'Time', value: `${gameStats.timeElapsed}s` }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        className="bg-lightBackground/50 dark:bg-darkBackground/50 p-4 sm:p-6 backdrop-blur-sm"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <p className="text-sm opacity-75">{stat.label}</p>
                                        <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Restart Button */}
                            <div className="flex justify-center mt-4 sm:mt-6">
                                <motion.button
                                    onClick={handleRestart}
                                    className={`flex justify-center items-center gap-4 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg ${sharedClass}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <RotateCcw size={24} />
                                    Restart
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default SinglePlayer
