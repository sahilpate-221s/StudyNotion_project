import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],
  fetchedAt: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReviews(state, action) {
      state.reviews = action.payload;
      state.fetchedAt = Date.now();
    },
  },
});

export const { setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
