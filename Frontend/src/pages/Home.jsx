import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProfile, getProfile } from "../store/Slice/profileSlice";
import { Keyboard, Users, Trophy, BarChart2,  UserRound } from 'lucide-react';
import { FaBolt } from "react-icons/fa";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const sharedClass = "bg-lightBackground dark:bg-darkBackground hover:bg-darkBackground dark:hover:bg-lightBackground text-darkBackground hover:text-lightBackground dark:text-lightBackground hover:dark:text-darkBackground border-2 border-darkBackground dark:border-lightBackground transition-colors duration-300";

function Home() {
  const { profile } = useSelector(getProfile);
  const dispatch = useDispatch();
  const [selectedMode, setSelectedMode] = useState(null);
  const navigate = useNavigate();

  const handleMultiplayer = () => {
    setSelectedMode('multiplayer');
    navigate("/room");
  };

  const handleSinglePlayer = (e) => {
    e.preventDefault();
    navigate("/single-player");
    setSelectedMode('single');
  };

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen text-darkBackground dark:text-lightBackground p-4 md:p-8 bg-lightBackground dark:bg-darkBackground transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Title */}
        <motion.div
          className="flex justify-center flex-col align-middle items-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-6xl text-center mb-2 font-black leading-snug">
            TypeRace
          </h1>
          {/* <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Keyboard className="mb-4 text-darkBackground dark:text-lightBackground" size={45} />
          </motion.div> */}
        </motion.div>

        {/* Greeting */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-lg md:text-2xl text-center mb-12"
        >
          Welcome back, <span className="font-semibold">{profile.username}</span>!
        </motion.div>

        {/* Mode Selection */}
        <motion.div
          className="flex flex-col md:flex-row justify-center gap-4 mb-12"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMultiplayer}
            className={`px-6 py-3 text-base md:text-lg font-medium ${sharedClass} ${selectedMode === 'multiplayer' ? 'opacity-75' : ''}`}
          >
            Multiplayer <Users className="inline-block ml-2" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSinglePlayer}
            className={`px-6 py-3 text-base md:text-lg font-medium ${sharedClass} ${selectedMode === 'single' ? 'opacity-75' : ''}`}
          >
            Single Player <UserRound className="inline-block ml-2" />
          </motion.button>
        </motion.div>

        {/* Feature Boxes */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            className={`p-8 md:p-12  ${sharedClass}`}
          >
            <h3 className="text-lg md:text-xl font-bold mb-3"><FaBolt className="inline-block ml-2" /> Speed Test</h3>
            <p>
              Compete in real-time typing challenges and improve your typing speed.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotateZ: -2 }}
            className={`p-8 md:p-12  ${sharedClass}`}
          >
            <h3 className="text-lg md:text-xl font-bold mb-3"><Trophy className="inline-block ml-2" /> Leaderboards </h3>
            <p>
              Climb the ranks and see how you stack up against other typers.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            className={`p-8 md:p-12  ${sharedClass}`}
          >
            <h3 className="text-lg md:text-xl font-bold mb-3"><BarChart2 className="inline-block ml-2" /> Analytics </h3>
            <p>
              Track your progress with detailed statistics and performance graphs.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;
