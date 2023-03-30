export const SET_LOGIN_STATE = "USER/SET_LOGIN_STATE";
export const SET_CURRENT_USER_ID = "USER/SET_CURRENT_USER_ID";

export const setLoginState = (payload: number) => {
  return {
    type: SET_LOGIN_STATE,
    login_state: payload,
  };
};

export const setCurrentUserId = (payload: string) => {
  return {
    type: SET_CURRENT_USER_ID,
    userId: payload,
  };
};
