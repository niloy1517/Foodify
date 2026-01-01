import express from 'express'
import { addRestaurant, deleteRestaurant, districtWiseRestaurant, filterRestaurantsByDistance, getRestaurant, getRestaurants, updateRestaurant } from '../controller/restaurant.controller.js'
import { uploads } from '../middleware/upload.js'

const restaurantRoute = express.Router()

restaurantRoute.post('/add', uploads.single('image'), addRestaurant)
restaurantRoute.delete('/delete/:id', deleteRestaurant)
restaurantRoute.post('/update', uploads.single('image'), updateRestaurant)
restaurantRoute.get('/list', getRestaurants)
restaurantRoute.get('/details/:id', getRestaurant)
restaurantRoute.get('/district/:id', districtWiseRestaurant)
restaurantRoute.get('/all/restaurants', filterRestaurantsByDistance)


export {restaurantRoute}