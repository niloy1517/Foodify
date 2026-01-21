import express from 'express'
import { addRestaurant, deleteRestaurant, districtWiseRestaurant, filterRestaurantsByDistance, getNearbyRestaurants, getFilteredRestaurants, getRestaurant, getRestaurants, getRestaurantsName, updateRestaurant } from '../controller/restaurant.controller.js'
import { uploads } from '../middleware/upload.js'

const restaurantRoute = express.Router()

restaurantRoute.post('/add', uploads.single('image'), addRestaurant)
restaurantRoute.delete('/delete/:id', deleteRestaurant)
restaurantRoute.post('/update', uploads.single('image'), updateRestaurant)
restaurantRoute.get('/list', getRestaurants)
restaurantRoute.get('/details/:id', getRestaurant)
restaurantRoute.get('/district/:id', districtWiseRestaurant)
restaurantRoute.get('/all/restaurants', filterRestaurantsByDistance)
restaurantRoute.get('/search', getFilteredRestaurants)
restaurantRoute.get('/name', getRestaurantsName)
restaurantRoute.get('/nearby', getNearbyRestaurants)

export {restaurantRoute}