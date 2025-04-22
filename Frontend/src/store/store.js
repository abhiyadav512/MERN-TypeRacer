import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "../store/Slice/themeSlice";
import authSlice from "../store/Slice/authSlice";
import profileSlice from "../store/Slice/profileSlice";

const store = configureStore({
  reducer: {
    darkMode: themeSlice,
    auth: authSlice,
    profile: profileSlice,
  },
});

export default store;
