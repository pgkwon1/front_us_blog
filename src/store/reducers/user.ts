import { SET_LOGIN_STATE } from "../actions/user";

const initialState = {
  login_state: 0,
};

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN_STATE:
      return {
        ...state,
        login_state: action.login_state,
      };
    default:
      return state;
  }
}
