import { createSlice } from "@reduxjs/toolkit";

const postReducer = createSlice({
  name: "postReducer",
  initialState: { currentTag: "", currentCategory: "" },
  reducers: {
    setCurrentTag: (state, action) => {
      state.currentTag = action.payload;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
});

export const { setCurrentTag, setCurrentCategory } = postReducer.actions;
export default postReducer.reducer;
