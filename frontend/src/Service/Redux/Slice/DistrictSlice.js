import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  districtData: null,
  districtId: null,
};

export const districtSlice = createSlice({
  name: "district",
  initialState,
  reducers: {
    setDistrictId: (state, action) => {
      state.districtId = action.payload;
    },
  },
});

export const { setDistrictId } = districtSlice.actions;
export default districtSlice.reducer;
