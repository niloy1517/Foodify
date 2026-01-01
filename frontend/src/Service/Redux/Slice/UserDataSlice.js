import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userData: [],
  newDeliveryAddress: {
    house: '',
    apartment: '',
    riderNote: '',
    label: ''
  }
}

export const userDataSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setNewDeliveryAddress: (state, action) => {
      state.newDeliveryAddress = action.payload
    }
  }
})


export const { setUserData, setNewDeliveryAddress } = userDataSlice.actions

export default userDataSlice.reducer