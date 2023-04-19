import { createSlice } from "@reduxjs/toolkit";

const userReducer = createSlice({
  name: "userReducer",
  initialState: { login_state: 0, userId: "" },
  reducers: {
    setLoginState: (state, action) => {
      state.login_state = action.payload;
    },

    setCurrentUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setLoginState, setCurrentUserId } = userReducer.actions;
export default userReducer.reducer;
