import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  fetchedAt: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
      state.fetchedAt = Date.now();
    },
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
