import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
import categoriesReducer from './Slices/categorySlice'
import restaurantsReducer from './Slices/restaurantSlice'
import foodReducer from './Slices/foodSlice'
import districtReducer from './Slices/districtSlice'

const rootReducer = combineReducers({
      categories: categoriesReducer,
    restaurant: restaurantsReducer,
    food: foodReducer,
    district: districtReducer,
})
 
const persistConfig = {
  key: 'root',
  storage,
}
 
const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: true
    })
})


export const persistor = persistStore(store)