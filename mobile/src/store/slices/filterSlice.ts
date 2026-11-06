import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductFilters {
  category: string | null;
  priceRange: [number, number];
  search: string;
  sortBy: string;
}

const initialState: ProductFilters = {
  category: null,
  priceRange: [0, 10000],
  search: '',
  sortBy: 'newest',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.category = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      return initialState;
    },
  },
});

export const { setCategory, setPriceRange, setSearch, setSortBy, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
