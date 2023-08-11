import { createSlice } from "@reduxjs/toolkit";

const globalReducer = createSlice({
  name: "globalReducer",
  initialState: {
    isError: false,
    errorMessage: "",
    isNotice: false,
    noticeMessage: "",
  },
  reducers: {
    setErrorInfo: (state, action) => {
      state.errorMessage = action.payload.errorMessage;
      state.isError = action.payload.isError;
    },

    setNoticeInfo: (state, action) => {
      state.isNotice = action.payload.isNotice;
      state.noticeMessage = action.payload.noticeMessage;
    },
  },
});

export const { setErrorInfo, setNoticeInfo } = globalReducer.actions;
export default globalReducer.reducer;
