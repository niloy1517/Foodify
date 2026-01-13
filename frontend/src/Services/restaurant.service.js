import { axiosInstance } from "../Api/axiosInstance"

export const restaurantService = {
    //Get all restaurants
    getAllRestaurantsName: () => axiosInstance.get('/restaurant/name'),

    //Get all restaurans by location
    getNearBy: ({lat, lng}) => axiosInstance.get('/restaurant/all/restaurants', 
        {
            params: {lat, lng}
        }
    ),

    //Get all foods
    getAllFoods: () => axiosInstance.get('/food/foods')
}
