import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "@/store/reducers/user";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
const rootReducer = combineReducers({
  userReducer,
});
const persistConfig = {
  key: process.env.NEXT_PUBLIC_REDUX_PERSIST_KEY,
  storage,
  whitelist: ["userReducer"],
};
const rootPersistReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: rootPersistReducer,
  devTools: true,
});
