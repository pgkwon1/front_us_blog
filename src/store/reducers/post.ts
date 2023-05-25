import { createSlice } from "@reduxjs/toolkit";

const postReducer = createSlice({
  name: "postReducer",
  initialState: {
    currentPostId: "",
    currentTag: "",
    currentCategory: "",
    editMode: false,
    editPostContents: "",
  },
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
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
    setEditPostContents: (state, action) => {
      state.editPostContents = action.payload;
    },
  },
});

export const {
  setCurrentPostId,
  setCurrentTag,
  setCurrentCategory,
  setEditMode,
  setEditPostContents,
} = postReducer.actions;
export default postReducer.reducer;
