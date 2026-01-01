import express from 'express'
import { restaurantFoodAdd, restaurantFoodDelete, getRestaurantFoodList, restaurantFoodUpdate, getFoodItem } from '../controller/food.controller.js'
import { uploads } from '../middleware/upload.js'

const foodRoute = express.Router()


foodRoute.post('/add', uploads.single('image'), restaurantFoodAdd)
foodRoute.put('/update', uploads.single('image'), restaurantFoodUpdate)
foodRoute.delete('/delete/:id', restaurantFoodDelete)
foodRoute.get('/list/:id', getRestaurantFoodList)
foodRoute.get('/item/:id', getFoodItem)
 



export {foodRoute}