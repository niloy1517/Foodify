import { axiosInstance } from "../Api/axiosInstance"

export const restaurantService = {
    //Get all restaurants
    getAll: () => axiosInstance.get('/restaurant/list'),

    //Get all restaurans by location
    getNearBy: ({lat, lng}) => axiosInstance.get('/restaurant/all/restaurants', 
        {
            params: {lat, lng}
        }
    )
}
