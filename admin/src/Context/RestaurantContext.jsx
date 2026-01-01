import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const storeContext = createContext(null)

const RestaurantContext = ({ children }) => {
  const [restaurantList, setRestaurantList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const initialRestaurantData = {
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    description: '',
    image: '',
    imagePath: null,
    address: '',
    city: '',
    zipcode: '',
    deliveryRadius: '',
    longitude: '',
    latitude: '',
    district: '',
    status: '',
    deliveryTime: '',
    deliveryFee: '',
    openingTime: '',
    closingTime: ''
  }

  const [restaurantData, setRestaurantData] = useState(initialRestaurantData)
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 })
  const [restaurantId, setRestaurantId] = useState('')

  axios.defaults.withCredentials = true

  const getRestaurantList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurant/list', {}, { withCredentials: true })
      setRestaurantList(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteRestaurant = async (restaurantId) => {
    try {
      const response = await axios.delete('http://localhost:5000/api/restaurant/delete', {
        data: { restaurantId },
        withCredentials: true
      })
      console.log(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }

  const locateLocation = () => {
    if (!navigator.geolocation) {
      setError('Browser not supported!')
      return
    }
    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setRestaurantData((prev) => ({
          ...prev,
          latitude: latitude,
          longitude: longitude
        }))
        setLoading(false)
      },
      (error) => {
        setError(error.message)
        setLoading(false)
      }
    )
  }

  const fetchLoctionData = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${restaurantData.latitude}&lon=${restaurantData.longitude}`
      )
      const data = await response.json()
      if (data) {
        const addr = data.address
        const shortAddress = [addr.road, addr.quarter, addr.suburb].filter(Boolean).join(',')
        setRestaurantData((prev) => ({
          ...prev,
          address: shortAddress || '',
          city: data.address.city || data.address.town || '',
          zipcode: data.address.postcode || data.address.zipcode || ''
        }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRestaurantList()
  }, [])

  useEffect(() => {
    fetchLoctionData()
  }, [restaurantData.latitude])

 
  const resetRestaurantData = () => {
    setRestaurantData(initialRestaurantData)
    setCoordinates({ lat: 0, lng: 0 })
    setRestaurantId('')
  }

  const contextValue = {
    restaurantList,
    deleteRestaurant,
    locateLocation,
    coordinates,
    setCoordinates,
    restaurantData,
    setRestaurantData,
    restaurantId,
    setRestaurantId,
    resetRestaurantData
  }

  return <storeContext.Provider value={contextValue}>{children}</storeContext.Provider>
}

export default RestaurantContext
