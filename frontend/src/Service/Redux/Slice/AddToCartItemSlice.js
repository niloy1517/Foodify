import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carts: { guest: {} },
  user: "guest",
  allRestaurantData: [],
  checkoutDetails: null,
  error: null,
};

export const addToCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userId = action.payload || "guest";
      state.user = userId;
      if (!state.carts[userId]) state.carts[userId] = {};
    },

    logoutUser: (state) => {
      state.user = "guest";
      state.carts = { guest: {} };
      state.allRestaurantData = [];
      state.checkoutDetails = null;
    },

    addToCart: (state, action) => {
      const { restaurantId, food, restaurantData } = action.payload;
      const userId = state.user || "guest";

      if (!state.carts[userId]) state.carts[userId] = {};
      if (!state.carts[userId][restaurantId]) state.carts[userId][restaurantId] = { items: [] };

      const existingRestaurantData = state.allRestaurantData.find(r => r._id === restaurantId);
      if (!existingRestaurantData) state.allRestaurantData.push(restaurantData);

      const existingFood = state.carts[userId][restaurantId].items.find(f => f._id === food._id);
      if (existingFood) {
        existingFood.quantity += 1;
      } else {
        state.carts[userId][restaurantId].items.push({ ...food, quantity: 1 });
      }
    },

    increment: (state, action) => {
      const food = action.payload;
      const restaurantId = food.restaurant;
      const userId = state.user || "guest";

      const restaurantCart = state.carts[userId]?.[restaurantId];
      if (!restaurantCart) return;

      const existingFood = restaurantCart.items.find(f => f._id === food._id);
      if (existingFood) existingFood.quantity += 1;
    },

    decrement: (state, action) => {
      const food = action.payload;
      const restaurantId = food.restaurant;
      const userId = state.user || "guest";

      const restaurantCart = state.carts[userId]?.[restaurantId];
      if (!restaurantCart) return;

      const existingFood = restaurantCart.items.find(f => f._id === food._id);
      if (!existingFood) return;

      if (existingFood.quantity > 1) {
        existingFood.quantity -= 1;
      } else {
        restaurantCart.items = restaurantCart.items.filter(f => f._id !== food._id);
      }
    },

    deleteToCart: (state, action) => {
      const food = action.payload;
      const restaurantId = food.restaurant;
      const userId = state.user || "guest";

      const restaurantCart = state.carts[userId]?.[restaurantId];
      if (!restaurantCart) return;

      restaurantCart.items = restaurantCart.items.filter(f => f._id !== food._id);
    },

    setCheckoutDetails: (state, action) => {
      state.checkoutDetails = action.payload;
    },

    deleteCartRestaurant: (state, action) => {
      const restaurantId = action.payload;
      const userId = state.user || "guest";

      const restaurantCart = state.carts[userId]?.[restaurantId];
      if (restaurantCart) restaurantCart.items = [];

      state.allRestaurantData = state.allRestaurantData.filter(r => r._id !== restaurantId);
    },

    clearRestaurantCart: (state, action) => {
      const { userId, restaurantId } = action.payload;
      if (state.carts[userId]?.[restaurantId]) delete state.carts[userId][restaurantId];

      state.allRestaurantData = state.allRestaurantData.filter(r => r._id !== restaurantId);
    },
  },
});

export const {
  setUser,
  addToCart,
  increment,
  decrement,
  deleteToCart,
  setCheckoutDetails,
  logoutUser,
  deleteCartRestaurant,
  clearRestaurantCart,
} = addToCartSlice.actions;

export default addToCartSlice.reducer;
