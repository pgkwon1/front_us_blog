import { createSlice } from "@reduxjs/toolkit";

const postReducer = createSlice({
  name: "postReducer",
  initialState: { currentPostId: "", currentTag: "", currentCategory: "" },
  reducers: {
    setCurrentPostId: (state, action) => {
      state.currentPostId = action.payload;
    },
    setCurrentTag: (state, action) => {
      state.currentTag = action.payload;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
});

export const { setCurrentPostId, setCurrentTag, setCurrentCategory } =
  postReducer.actions;
export default postReducer.reducer;
