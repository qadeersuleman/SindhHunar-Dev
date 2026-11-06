import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  role: 'customer' | 'seller' | 'admin' | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
}

const initialState: AuthState = {
  token: null,
  role: null,
  isAuthenticated: false,
  isInitialLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; role: any }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.isInitialLoading = false;
    },
    clearAuth: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isInitialLoading = false; // Ensure navigator doesn't show splash after logout
    },
    setInitialLoading: (state, action: PayloadAction<boolean>) => {
      state.isInitialLoading = action.payload;
    },
  },
});

export const { setAuth, clearAuth, setInitialLoading } = authSlice.actions;
export default authSlice.reducer;