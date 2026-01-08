import { useEffect, useState } from "react"
import { restaurantService } from "../Services/restaurant.service"

export const useAllRestaurants = () => {
    const [restaurants, setRestaurants] = useState([])

    useEffect(() => {
        const restaurantsFetch = async () => {
            try {
                const response = await restaurantService.getAll()
                setRestaurants(response.data.data)
            } catch (error) {
                console.log(error)
            }
        }

        restaurantsFetch()
    }, [])

    return { restaurants }
}