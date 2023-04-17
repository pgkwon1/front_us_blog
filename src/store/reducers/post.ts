import { SET_CURRENT_TAG } from "../actions/post";

const initialState = {
  currentTag: "",
};
export default function postReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case SET_CURRENT_TAG:
      return {
        ...state,
        currentTag: action.data,
      };
    default:
      return state;
  }
}
