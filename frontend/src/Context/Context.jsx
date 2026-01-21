import React, { createContext, useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { restaurantService } from '../Services/restaurant.service'


export const storeContext = createContext(null)

const Context = ({ children }) => {
  const [showAuthenticationPopup, setShowAuthenticationPopup] = useState(false)
  const [loginPopup, setLoginPopup] = useState(false)
  const [isLoginPage, setIsLoginPage] = useState(true)
  const [userProfileData, setUserProfileData] = useState('')
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [coordinates, setCoordinates] = useState({ lat: 23.8103, lng: 90.4125 })

  const [address, setAddress] = useState('')
  const [userCartModal, setUserCartModal] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [suggestAddress, setSuggestAddress] = useState([])

  const [findFoodByLocationPopup, setFindFoodByLocationPopup] = useState(false)


  //Auto suggest search key address
  const [addressData, setAddressData] = useState('')

  const [isMobileFilterbarModal, setIsMobileFilterbarModal] = useState(false)


  //Restaurants
  const [restaurants, setRestaurants] = useState([]);

  //Category Id
  const [categoryId, setCategoryId] = useState('')

  //Global overlay state
  const [isOverlay, setIsOverlay] = useState(false)

  //DropdownManu state connected with global overlay state
    const [isDropdownMenu, setIsDropdownMenu] = useState(false);

  //Restaurants filter state
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('filters');
    return saved ? JSON.parse(saved)
      : {
        sortBy: "",
        cuisine: "",
        rating: "",
        priceOrder: "",
        category: ""
      }

  })

  useEffect(() => {
    const savedFilters = localStorage.getItem('filters')

    if (savedFilters) {
      setFilters(JSON.parse(savedFilters))
    } else {
      console.log('nothing found ', savedFilters)
    }
  }, [])


  useEffect(() => {
    if (filters) {
      localStorage.setItem('filters', JSON.stringify(filters))
    }
  }, [filters])


  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // store user location from localStorage
  const userLocation = JSON.parse(localStorage.getItem('defaultLocation'))



  // Clear All
  const clearFilter = async () => {
    localStorage.setItem('filters', JSON.stringify({
      sortBy: "",
      cuisine: "",
      rating: "",
      priceOrder: ""
    }))

    setFilters({
      sortBy: "",
      cuisine: "",
      rating: "",
      priceOrder: ""
    })


    try {
      const response = await restaurantService.getNearBy({ lat: userLocation.lat, lng: userLocation.lon });
      setRestaurants(response.data.data)
    } catch (error) {
      console.log(error);
    }
  };


  const getFilteredRestaurants = async () => {

    const userLat = userLocation?.lat;
    const userLng = userLocation?.lon;

    let query = new URLSearchParams();

    if (filters.sortBy) query.append('sortBy', filters.sortBy);
    if (filters.cuisine) query.append('cuisine', filters.cuisine);
    if (filters.rating) query.append('rating', filters.rating);
    if (filters.priceOrder) query.append('priceOrder', filters.priceOrder);
    if(filters.category) query.append('category', filters.category)
    if (userLat) query.append('lat', userLat);
    if (userLng) query.append('lng', userLng);


    try {
      const response = await axios.get(
        `http://localhost:5000/api/restaurant/search?${query.toString()}`
      );

      if (response.data.message) {
        setRestaurants(response.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  };


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
    userCartModal, setUserCartModal,
    addressData, setAddressData,
    isMobileFilterbarModal, setIsMobileFilterbarModal,
    restaurants, setRestaurants,
    isOverlay, setIsOverlay,
    isDropdownMenu, setIsDropdownMenu,
    filters, setFilters,
    updateFilter,
    clearFilter,
    getFilteredRestaurants,
    categoryId, setCategoryId
  }
  return (
    <storeContext.Provider value={contextValue}>
      {children}
    </storeContext.Provider>
  )
}

export default Context