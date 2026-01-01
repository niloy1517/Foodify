import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  foods: [],
  foodId: null,
  foodData: null,
  loading: false
}

export const foodsSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setFoods: (state, action) => {
      state.foods = action.payload
    },
    setFoodId: (state, action) => {
      state.foodId = action.payload
    },
    setFoodData: (state, action) => {
        state.foodData = action.payload
    },
    loading: (state, action) => {
      state.loading = action.payload
    },
  },
})


export const { setFoods, setFoodId, setFoodData } = foodsSlice.actions

export default foodsSlice.reducer