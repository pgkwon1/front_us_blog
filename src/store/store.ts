import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "@/store/reducers/global";
import userReducer from "@/store/reducers/user";
import postReducer from "./reducers/post";
import profileReducer from "@/store/reducers/profile";
import projectReducer from "@/store/reducers/project";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
const rootReducer = combineReducers({
  globalReducer,
  userReducer,
  postReducer,
  profileReducer,
  projectReducer,
});
const persistConfig = {
  key:
    process.env.NEXT_PUBLIC_REDUX_PERSIST_KEY !== undefined
      ? process.env.NEXT_PUBLIC_REDUX_PERSIST_KEY
      : "",
  storage,
  whitelist: ["userReducer", "postReducer", "profileReducer", "globalReducer"],
};
const rootPersistReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: rootPersistReducer,
  devTools: true,
});
