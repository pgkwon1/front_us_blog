import { createSlice } from "@reduxjs/toolkit";

const globalReducer = createSlice({
  name: "globalReducer",
  initialState: {
    isError: false,
    errorMessage: "",
  },
  reducers: {
    setErrorInfo: (state, action) => {
      state.errorMessage = action.payload.errorMessage;
      state.isError = action.payload.isError;
    },
  },
});

export const { setErrorInfo } = globalReducer.actions;
export default globalReducer.reducer;
