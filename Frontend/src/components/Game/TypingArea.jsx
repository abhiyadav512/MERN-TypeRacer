// TypingArea.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TypingArea = ({ text, onProgress, timeLimit, onTimeUp }) => {
    const [input, setInput] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [mistakes, setMistakes] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        setInput('');
        setStartTime(null);
        setWpm(0);
        setAccuracy(100);
        setProgress(0);
        setTimeLeft(timeLimit);
        setMistakes([]);
        setIsFinished(false);
        inputRef.current?.focus();
    }, [text, timeLimit]);

    useEffect(() => {
        if (!startTime || isFinished) return;

        const timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = timeLimit - elapsed;

            if (remaining <= 0) {
                clearInterval(timer);
                setTimeLeft(0);
                setIsFinished(true);

                const finalStats = {
                    wpm,
                    accuracy,
                    mistakes,
                    charsTyped: input.length,
                    timeElapsed: timeLimit,
                    correctChars: input.split('').filter((char, i) => char === text[i]).length
                };

                onTimeUp(finalStats);
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        // Cleanup function to clear the timer when the component unmounts or the game finishes
        return () => clearInterval(timer);
    }, [startTime, timeLimit, input, text, wpm, accuracy, mistakes, progress]);

    const calculateAccuracy = (input, text) => {
        if (input.length === 0) return 100;
        let correct = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] === text[i]) correct++;
        }

        // Accuracy Formula
        return Math.round((correct / input.length) * 100);
    };

    const handleInput = (e) => {
        if (isFinished) return;

        const newInput = e.target.value;
        setInput(newInput);

        if (!startTime && newInput.length === 1) {
            setStartTime(Date.now());
        }

        const lastChar = newInput[newInput.length - 1];
        const expectedChar = text[newInput.length - 1];

        if (lastChar !== expectedChar) {
            setMistakes(prev => [...prev, {
                expected: expectedChar,
                typed: lastChar,
                position: newInput.length - 1
            }]);
        }
        const newProgress = Math.floor((newInput.length / text.length) * 100);
        setProgress(newProgress);

        let currentWpm = 0;
        if (startTime) {
            const timeElapsed = (Date.now() - startTime) / 1000 / 60;
            const wordsTyped = newInput.length / 5;
            currentWpm = Math.round(wordsTyped / timeElapsed);
        }

        const currentAccuracy = calculateAccuracy(newInput, text);

        setWpm(currentWpm);
        setAccuracy(currentAccuracy);
        onProgress(newProgress, currentWpm, currentAccuracy);

        if (newInput.length === text.length) {
            setIsFinished(true);
            const finalStats = {
                wpm: currentWpm,
                accuracy: currentAccuracy,
                mistakes,
                charsTyped: newInput.length,
                timeElapsed: Math.floor((Date.now() - startTime) / 1000),
                correctChars: newInput.split('').filter((char, i) => char === text[i]).length
            };
            onTimeUp(finalStats);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <span className="text-2xl font-bold">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
            </div>

            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-darkBackground dark:bg-lightBackground text-lightBackground dark:text-darkBackground">
                            Progress
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block">
                            {progress}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-darkBackground dark:bg-lightBackground"
                    />
                </div>
            </div>

            <div className="mb-4 p-4 bg-opacity-10 bg-darkBackground  rounded-lg font-mono text-lg relative">
                {text.split('').map((char, index) => {
                    let colorClass = 'text-darkBackground/50 dark:text-lightBackground/50 opacity-50';
                    if (index < input.length) {
                        colorClass = input[index] === char
                            ? 'dark:text-lightBackground text-darkBackground font-semibold'
                            : 'text-red-600 dark:text-red-400 font-semibold';
                    }
                    return (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.01 }}
                            className={`${colorClass} text-xl`}
                        >
                            {char}
                        </motion.span>
                    );
                })}
            </div>

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInput}
                    onPaste={(e) => e.preventDefault()} // Disable pasting
                    className="w-full p-3 border-2 rounded-lg bg-transparent border-darkBackground dark:border-lightBackground focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-darkBackground dark:focus:ring-lightBackground transition-all duration-300 text-darkBackground dark:text-lightBackground"
                    placeholder="Start typing..."
                    autoFocus
                />


                <div className="absolute -top-3 right-3 flex gap-4">
                    <span className="px-2 py-1 text-sm rounded-full bg-darkBackground dark:bg-lightBackground text-lightBackground dark:text-darkBackground font-semibold">
                        WPM: {wpm}
                    </span>
                    <span className="px-2 py-1 text-sm rounded-full bg-darkBackground dark:bg-lightBackground text-lightBackground dark:text-darkBackground font-semibold">
                        Accuracy: {accuracy}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TypingArea;
