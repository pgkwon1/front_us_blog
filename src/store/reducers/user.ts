import { SET_LOGIN_STATE, SET_CURRENT_USER_ID } from "../actions/user";

const initialState = {
  login_state: 0,
  userId: "",
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN_STATE:
      return {
        ...state,
        login_state: action.login_state,
      };
    case SET_CURRENT_USER_ID:
      return {
        ...state,
        userId: action.userId,
      };
    default:
      return state;
  }
}
