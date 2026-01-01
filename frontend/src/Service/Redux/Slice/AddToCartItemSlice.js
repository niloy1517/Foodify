import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    carts: {
        guest: {}
    },
    user: 'guest',
    allRestaurantData: [],
    checkoutDetails: null,
    error: null,
}

export const addToCartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const userId = action.payload;

            state.user = userId || "guest";

            if (!state.carts[userId]) {
                state.carts[userId] = {}
            }
        },
        logoutUser: (state) => {
            state.user = "guest";

            state.carts["guest"] = {};
        },

        addToCart: (state, action) => {
            const { restaurantId, food, restaurantData } = action.payload;

            const userId = state.user || "guest"

            if (!state.carts[userId]) {
                state.carts[userId] = {}
            }

            if (!state.carts[userId][restaurantId]) {
                state.carts[userId][restaurantId] = { items: [] }
            }


            if (!Array.isArray(state.allRestaurantData)) {
                state.allRestaurantData = [];
            }

            const existingRestaurantData = state.allRestaurantData.find(restaurantData => restaurantData._id === restaurantId)

            if (!existingRestaurantData) {
                state.allRestaurantData.push(restaurantData)
            }


            const existingFood = state.carts[userId][restaurantId].items.find(f => f._id === food._id)

            if (existingFood) {
                existingFood.quantity += 1;
            } else {
                state.carts[userId][restaurantId].items.push({
                    ...food,
                    quantity: 1
                })
            }
        },
        increment: (state, action) => {
            const food = action.payload;
            const restaurantId = food.restaurant;

            const userId = state.user || "guest";


            const existingFood = state.carts[userId][restaurantId].items.find(f => f._id === food._id)

            if (existingFood) {
                existingFood.quantity += 1;
            }

        },
        decrement: (state, action) => {
            const food = action.payload;
            const restaurantId = food.restaurant;

            const userId = state.user || "guest";


            const existingFood = state.carts[userId][restaurantId].items.find(f => f._id === food._id)

            if (existingFood) {
                existingFood.quantity -= 1;
            }

        },
        deleteToCart: (state, action) => {
            const food = action.payload;
            const restaurantId = food.restaurant;

            const userId = state.user || "guest";

            state.carts[userId][restaurantId].items = state.carts[userId][restaurantId].items.filter(f => f._id !== food._id)
        },
        setCheckoutDetails: (state, action) => {
            state.checkoutDetails = action.payload;
            console.log('checkoutData', action.payload)
        },
        deleteCartRestaurant: (state, action) => {
            const restaurantId = action.payload;

            const userId = state.user || "guest";

            state.carts[userId][restaurantId].items = [];

            state.allRestaurantData = state.allRestaurantData.filter(restaurantData => restaurantData._id !== restaurantId)
        }
    }
})


export const { setUser, addToCart, increment, decrement, deleteToCart, setCheckoutDetails, logoutUser, deleteCartRestaurant } = addToCartSlice.actions

export default addToCartSlice.reducer


