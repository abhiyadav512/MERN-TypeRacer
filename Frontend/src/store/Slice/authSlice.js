import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import mainApi from "../../api/mainApi";
import axios from "axios";

// require('dotenv').config();

// const baseUrl = import.meta.env.VITE_APP_API_URL;
// const baseUrl = "http://localhost:3000";
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/login`, credentials);
      localStorage.setItem("typeToken", response.data.token);
      // console.log(response);
      // console.log(baseUrl);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      // Store the token in local storage after successful Google login
      localStorage.setItem("typeToken", token);
      return { token }; // Return the token so it can be stored in Redux state
    } catch (error) {
      // Handle errors if any, and reject the action
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await mainApi.post("/api/auth/signup", credentials);
      // console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem("typeToken") || null,
  isAuthUser: localStorage.getItem("typeToken") ? true : false,
  status: "idle",
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("typeToken");
      state.user = null;
      state.token = null;
      state.isAuthUser = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        localStorage.setItem("typeToken", payload.token);
        state.user = payload.user;
        state.isAuthUser = true;
        state.status = "succeeded";
      })
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isAuthUser = false;
        state.status = "failed";
        state.error = payload;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      })
      .addCase(loginWithGoogle.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        localStorage.setItem("typeToken", payload.token);
        state.user = payload.user;
        state.isAuthUser = true;
        state.status = "succeeded";
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithGoogle.rejected, (state, { payload }) => {
        state.isAuthUser = false;
        state.status = "failed";
        state.error = payload;
      });
  },
});

export const { logout } = authSlice.actions;

export const getToken = (state) => state.auth.token;
export const getIsUserAuth = (state) => state.auth.isAuthUser;
export const getStatus = (state) => state.auth.status;
export const getError = (state) => state.auth.error;

export default authSlice.reducer;
