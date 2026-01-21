import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurants: [],
  filteredRestaurants: [],
  restaurantId: null,
  restaurantData: null,
  loading: false,
};

export const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurants: (state, action) => (state.restaurants = action.payload),
    setRestaurantId: (state, action) => (state.restaurantId = action.payload),
    setRestaurantData: (state, action) => (state.restaurantData = action.payload),
    setLoading: (state, action) => (state.loading = action.payload),
    setFilteredRestaurants: (state, action) => (state.filteredRestaurants = action.payload),
  },
});

export const { setRestaurants, setRestaurantId, setRestaurantData, setLoading, setFilteredRestaurants } =
  restaurantSlice.actions;
export default restaurantSlice.reducer;
