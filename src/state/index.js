import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  otp: null, // new
  posts: [],
  searchType: "people",
  searchValue: "",
  searchResults: {
    people: [],
    posts: [],
  },
  hashtagPosts: [],
  friendRequestsTo: [],
  notifications: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.notifications = action.payload.notifications;
    },
    setLogout: (state, action) => {
      state.user = null;
      state.token = null;
      state.posts = [];
      state.searchType = "people";
      state.searchValue = "";
      state.searchResults.people = [];
      state.searchResults.posts = [];
      state.hashtagPosts = [];
      state.friendRequestsTo = []; // Reset friend requests on logout
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setFriendRequestTo: (state, action) => {
      state.friendRequestsTo.push(action.payload);
    },
    setUnknownPeople: (state, action) => {
      if (state.user) {
        state.user.unknown = action.payload.unknown;
      } else {
        console.error("unknown non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPost = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPost;
    },
    setOtp: (state, action) => {
      //new
      state.otp = action.payload.otp;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    clearToken: (state) => {
      state.token = null;
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setHashtagPosts: (state, action) => {
      state.hashtagPosts = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload
      );
    },
    // sentFriendRequestTo: (state, action) => {
    //   if (state.user) {
    //     state.user.friendRequestsSentTo = action.payload.friendRequests;
    //   } else {
    //     console.error("user non-existent :(");
    //   }
    // },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setUnknownPeople,
  setPosts,
  setPost,
  setOtp,
  setUser,
  setToken,
  clearToken,
  setSearchType,
  setSearchValue,
  setSearchResults,
  setHashtagPosts,
  setFriendRequestTo,
  setNotifications,
  removeNotification,
} = authSlice.actions;
export default authSlice.reducer;
