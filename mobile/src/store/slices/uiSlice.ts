import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  modalVisible: boolean;
}

const initialState: UIState = {
  theme: 'light',
  isLoading: false,
  modalVisible: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setModalVisible: (state, action: PayloadAction<boolean>) => {
      state.modalVisible = action.payload;
    },
  },
});

export const { toggleTheme, setLoading, setModalVisible } = uiSlice.actions;
export default uiSlice.reducer;
