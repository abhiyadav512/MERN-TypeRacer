import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl = "http://localhost:3000";
// const baseUrl = import.meta.env.VITE_APP_API_URL;

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("typeToken");
    try {
      const response = await axios.get(`/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchGameHistory = createAsyncThunk(
  "profile/fetchGameHistory",
  async (username, { rejectWithValue }) => {
    const token = localStorage.getItem("typeToken");
    try {
      const response = await axios.get(`/api/game/history/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (updatedData, { rejectWithValue }) => {
    const token = localStorage.getItem("typeToken");

    // Convert updatedData to FormData if there is an image
    const formData = new FormData();
    formData.append("username", updatedData.username);
    formData.append("userWeight", updatedData.userWeight);

    if (updatedData.profilePicture instanceof File) {
      formData.append("image", updatedData.profilePicture);
    }

    try {
      const response = await axios.put(`/api/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const fetchFriends = createAsyncThunk(
//   "profile/fetchFriends",
//   async (_, { getState, rejectWithValue }) => {
//     const token = getState().auth.token;
//     try {
//       const response = await axios.get(`${baseUrl}/api/friends`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// followId is = who will be follow and unfollow
// Follow User
// export const followUser = createAsyncThunk(
//   "profile/followUser",
//   async (followId, { getState, rejectWithValue }) => {
//     const token = getState().auth.token;
//     try {
//       const response = await axios.put(
//         `${baseUrl}/api/friends/follow/${followId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data; // { message: "Followed successfully" }
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Unfollow User
// export const unfollowUser = createAsyncThunk(
//   "profile/unfollowUser",
//   async (unfollowId, { getState, rejectWithValue }) => {
//     const token = getState().auth.token;
//     try {
//       const response = await axios.put(
//         `${baseUrl}/api/friends/unfollow/${unfollowId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response.data; // { message: "Unfollowed successfully" }
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

const initialState = {
  profile: "",
  status: "idle",
  error: null,
  friends: [],
  gameHistory: [],
};
export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, { payload }) => {
        state.profile = payload;
        state.status = "succeeded";
      })
      .addCase(fetchProfile.rejected, (state, { payload }) => {
        state.status = "failed";
        state.error = payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.profile = payload;
        state.status = "succeeded";
      })
      .addCase(updateProfile.rejected, (state, { payload }) => {
        state.error = payload;
        state.status = "failed";
      })

      // Game History Fetching
      .addCase(fetchGameHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGameHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.gameHistory = action.payload.gameHistory;
      })
      .addCase(fetchGameHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    // Fetch Friends
    // .addCase(fetchFriends.pending, (state) => {
    //   state.status = "loading";
    // })
    // .addCase(fetchFriends.fulfilled, (state, { payload }) => {
    //   state.friends = payload;
    //   state.status = "succeeded";
    // })
    // .addCase(fetchFriends.rejected, (state, { payload }) => {
    //   state.error = payload;
    //   state.status = "failed";
    // })

    // // Follow User
    // .addCase(followUser.pending, (state) => {
    //   state.status = "loading";
    // })
    // .addCase(followUser.fulfilled, (state, { payload }) => {
    //   state.status = "succeeded";
    //   state.profile.following = [...state.profile.following, payload.userId];
    // })
    // .addCase(followUser.rejected, (state, { payload }) => {
    //   state.status = "failed";
    //   state.error = payload;
    // })
    // // Unfollow User
    // .addCase(unfollowUser.pending, (state) => {
    //   state.status = "loading";
    // })
    // .addCase(unfollowUser.fulfilled, (state, { payload }) => {
    //   state.status = "succeeded";
    //   state.profile.following = state.profile.following.filter(
    //     (id) => id !== payload.userId
    //   );
    // })
    // .addCase(unfollowUser.rejected, (state, { payload }) => {
    //   state.status = "failed";
    //   state.error = payload;
    // });
  },
});

export const getProfile = (state) => state.profile;
export const getProfileStatus = (state) => state.profile.status;
export const getProfileError = (state) => state.profile.error;
// export const getFriends = (state) => state.profile.friends;

export default profileSlice.reducer;
