import { createSlice } from "@reduxjs/toolkit";

const projectReducer = createSlice({
  name: "projectReducer",
  initialState: {
    projectThumb: "",
    projectPhoto1: "",
    projectPhoto2: "",
    projectPhoto3: "",
  },
  reducers: {
    setProjectThumb(state, action) {
      state.projectThumb = action.payload;
    },
    setProjectPhoto1(state, action) {
      state.projectPhoto1 = action.payload;
    },
    setProjectPhoto2(state, action) {
      state.projectPhoto2 = action.payload;
    },
    setProjectPhoto3(state, action) {
      state.projectPhoto3 = action.payload;
    },
  },
});

export const {
  setProjectThumb,
  setProjectPhoto1,
  setProjectPhoto2,
  setProjectPhoto3,
} = projectReducer.actions;
export default projectReducer.reducer;
