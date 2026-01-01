

import { combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'



import { configureStore } from '@reduxjs/toolkit'

import restaurantReducer from './Slice/RestaurantSlice'
import addtoCartReducer from './Slice/AddToCartItemSlice'
import categoryReducer from './Slice/CategorySlice'
import districtReducer from './Slice/DistrictSlice'
import userDataReducer from './Slice/UserDataSlice'

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  restaurant: restaurantReducer,
  cart: addtoCartReducer,
  category: categoryReducer,
  district: districtReducer,
  user: userDataReducer,
})



const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})


export const persistor = persistStore(store)