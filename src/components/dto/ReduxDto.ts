import { Reducer } from "redux";

export interface IRootState {
  userReducer: Reducer;
  postReducer: Reducer;
}
