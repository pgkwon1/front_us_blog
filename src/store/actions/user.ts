export const SET_LOGIN_STATE = "USER/SET_LOGIN_STATE";

export const setLoginState = (payload: number) => {
  return {
    type: SET_LOGIN_STATE,
    login_state: payload,
  };
};
