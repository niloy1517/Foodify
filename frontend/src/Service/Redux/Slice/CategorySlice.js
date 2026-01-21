import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    cateogories: []
}


export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.cateogories = action.payload
        }
    }
})


export const { setCategories } = categorySlice.actions;

export default categorySlice.reducer;