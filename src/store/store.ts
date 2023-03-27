import { combineReducers, createStore } from "redux";
import { userReducer } from "@/store/reducers/user";
import { composeWithDevTools } from "redux-devtools-extension";
const rootReducer = combineReducers({
  userReducer,
});

export const store = createStore(rootReducer, composeWithDevTools());
