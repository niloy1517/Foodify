import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  categories: [],
  categoryId: null,
  categoryData: null,
  loading: false
}

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    categories: (state, action) => {
      state.categories = action.payload
    },
    categoryId: (state, action) => {
      state.categoryId = action.payload
    },
    categoryData: (state, action) => {
        state.categoryData = action.payload
    },
    loading: (state, action) => {
      state.loading = action.payload
    },
  },
})


export const { categories, categoryId, categoryData, loading } = categoriesSlice.actions

export default categoriesSlice.reducer