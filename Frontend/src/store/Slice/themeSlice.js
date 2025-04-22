import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: localStorage.getItem("theme") === "dark",
};

// Apply initial theme to the DOM
if (initialState.darkMode) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// Function to update the meta tag theme color
const updateMetaThemeColor = (theme) => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (theme === "dark") {
    metaThemeColor.setAttribute("content", "#1a202c"); // Dark mode color
  } else {
    metaThemeColor.setAttribute("content", "#ffffff"); // Light mode color
  }
};

const themeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      const theme = state.darkMode ? "dark" : "light";
      localStorage.setItem("theme", theme);

      // Update theme class on the document
      if (state.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Update meta theme color
      updateMetaThemeColor(theme);
    },
    setTheme: (state, action) => {
      state.darkMode = action.payload === "dark";
      localStorage.setItem("theme", action.payload);

      // Update theme class on the document
      if (state.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Update meta theme color
      updateMetaThemeColor(action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const getTheme = (state) => state.darkMode.darkMode;

export default themeSlice.reducer;
