import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { getTheme, toggleTheme } from "../../store/Slice/themeSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(getTheme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="flex items-center">
      <label
        className="relative inline-flex items-center cursor-pointer"
        aria-label="Toggle Dark Mode"
      >
        {/* Hidden Checkbox */}
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={handleToggle}
          className="sr-only peer"
        />
        {/* Slider Track */}
        <div className="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-yellow-500 transition-colors duration-300 relative">
          {/* Slider Knob */}
          <div
            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ${isDarkMode ? "translate-x-8" : "translate-x-0"
              }`}
          >
            {isDarkMode ? (
              <MdOutlineDarkMode size={16} className="text-yellow-500" />
            ) : (
              <MdOutlineLightMode size={16} className="text-gray-500" />
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default ThemeToggle;
