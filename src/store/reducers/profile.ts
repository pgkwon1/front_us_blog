import { createSlice } from "@reduxjs/toolkit";

const profileReducer = createSlice({
  name: "profileReducer",
  initialState: {
    profileId: "",
    profilePicture: "",
    profileOwner: false,
    profileUserId: "",
  },
  reducers: {
    setProfileId: (state, action) => {
      state.profileId = action.payload;
    },
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
    setProfileOwner: (state, action) => {
      state.profileOwner = action.payload;
    },
    setProfileUserId: (state, action) => {
      state.profileUserId = action.payload;
    },
  },
});

export const {
  setProfileId,
  setProfilePicture,
  setProfileOwner,
  setProfileUserId,
} = profileReducer.actions;
export default profileReducer.reducer;
