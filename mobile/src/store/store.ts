import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import filterReducer from "./slices/filterSlice";
import cartReducer from "./slices/cartSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  filters: filterReducer,
  cart: cartReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart', 'auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;