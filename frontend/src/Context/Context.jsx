import React, { createContext, useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'


export const storeContext = createContext(null)

const Context = ({ children }) => {
  const [showAuthenticationPopup, setShowAuthenticationPopup] = useState(false)
  const [loginPopup, setLoginPopup] = useState(false)
  const [isLoginPage, setIsLoginPage] = useState(true)
  const [userProfileData, setUserProfileData] = useState('')
  const [userProfilePopup, setUserProfilePopup] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [coordinates, setCoordinates] = useState({ lat: 23.8103, lng: 90.4125 })

  const [address, setAddress] = useState('')
  const [userCartModal, setUserCartModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [suggestAddress, setSuggestAddress] = useState([])

  const [findFoodByLocationPopup, setFindFoodByLocationPopup] = useState(false)

  const [searchRestaurants, setSearchRestaurants] = useState([])

  //Auto suggest search key address
  const [addressData, setAddressData] = useState('')

  const [isMobileFilterbarModal, setIsMobileFilterbarModal] = useState(false)

  //Fitered restaurants shows
  const [showFilteredRestaurant, setShowFilteredRestaurant] = useState(false)

  //Restaurants
  const [restaurants, setRestaurants] = useState([]);


  const fetchLocationAddress = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json()

      if (data) {
        const addressPart = data.address;
        let part = [
          addressPart.quarter,
          addressPart.suburb,
          addressPart.village,
          addressPart.town,
          addressPart.city,
          addressPart.road,
          addressPart.postcode
        ].filter(Boolean)

        if (addressPart.quarter || addressPart.suburb || addressPart.city || addressPart.town || addressPart.village || addressPart.road || addressPart.postcode) {
          const short = part.slice(1, 5, + addressPart.postcode).join(', ')
          setAddress({ ...address, addressPart, short })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }


  const locateLocation = () => {
    if (!navigator.geolocation) {
      setError('Browser not supported!')
      return
    }

    setError(null)
    setLoading(true)

    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCoordinates({ lat: latitude, lng: longitude })
      fetchLocationAddress(latitude, longitude)
      setLoading(false)
     
    }, (error) => {
      setError(error.message)
      setLoading(false)
    })
  }



  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=BD&addressdetails=1&limit=10&q=${encodeURIComponent(query + ', Bangladesh')}
`)
      const data = await response.json()

      const filltered = data.filter((place) =>
        place.type === 'city' ||
        place.type === 'town' ||
        place.type === 'village' ||
        place.type === 'neighbourhood' ||
        place.type === 'hamlet'
      )

      setSuggestAddress(filltered)
    } catch (error) {
      console.log(error)
    }
  }


  //SERVER URL
  const SERVER_URL = 'http://localhost:5000';


  const contextValue = {
    showAuthenticationPopup, setShowAuthenticationPopup,
    SERVER_URL,
    loginPopup, setLoginPopup,
    isLoginPage, setIsLoginPage,
    userProfileData, setUserProfileData,
    profileDropdown, setProfileDropdown,
    locateLocation,
    coordinates, setCoordinates,
    address, setAddress,
    fetchSuggestions,
    suggestAddress,
    findFoodByLocationPopup, setFindFoodByLocationPopup,
    userProfilePopup, setUserProfilePopup,
    userCartModal, setUserCartModal,
    addressData, setAddressData,
    isMobileFilterbarModal, setIsMobileFilterbarModal,
    restaurants, setRestaurants,
  }
  return (
    <storeContext.Provider value={contextValue}>
      {children}
    </storeContext.Provider>
  )
}

export default Context