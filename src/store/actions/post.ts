export const SET_CURRENT_TAG = "POST/SET_CURRENT_TAG";

export const setCurrentTag = (payload: string) => {
  console.log("payload", payload);
  return {
    type: SET_CURRENT_TAG,
    data: payload,
  };
};
