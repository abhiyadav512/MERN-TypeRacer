import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, X, RotateCcw } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';


const GameResultsModal = ({ results, onClose, onPlayAgain }) => {
  const { width, height } = useWindowSize();

  // here also we need to sort . for back we get random(for only display stat )
  const sortedPlayers = [...results.players].sort((a, b) => {
    const scoreA = Math.pow(a.accuracy / 100, 2) * a.wpm; // Square the accuracy instead of the 4th power
    const scoreB = Math.pow(b.accuracy / 100, 2) * b.wpm; // Square the accuracy instead of the 4th power

    // console.log(`ScoreA: ${scoreA}, ScoreB: ${scoreB}`); // Check the computed scores
    return scoreB - scoreA; // Sort in descending order (higher score wins)
  });

  const winner = sortedPlayers[0];
  
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Confetti width={width} height={height} />

      <div className="relative bg-lightBackground dark:bg-darkBackground p-8 rounded-lg shadow-2xl max-w-2xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-darkBackground dark:text-lightBackground hover:text-red-600"
        >
          <X size={24} />
        </button>

        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h2 className="text-3xl font-bold text-darkBackground dark:text-lightBackground">
            Game Results
          </h2>

          {/* Winner Section */}
          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg mb-6">
            <Award className="w-8 h-8 mx-auto text-yellow-600 dark:text-yellow-400 mb-2" />
            <p className="text-lg font-semibold">
              Winner: {winner.username}
            </p>
            <p className="text-sm">
              WPM: {winner.wpm} | Accuracy: {winner.accuracy}%
            </p>
          </div>

          {/* All Players Results */}
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.username}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">{player.username}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{player.wpm} WPM</p>
                  <p className="text-sm">{player.accuracy}% Accuracy</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameResultsModal; 