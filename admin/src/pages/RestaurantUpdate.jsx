import React, { useContext, useEffect, useRef, useState } from 'react'

import { GrRestaurant } from "react-icons/gr";
import { FaLocationDot, FaRegImages } from "react-icons/fa6";
import { LuLocateFixed } from "react-icons/lu";
import { MdRestaurant } from "react-icons/md";
import { storeContext } from '../Context/RestaurantContext';

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { axiosInstance } from '../Api/axiosInstance';


const RestaurantUpadte = () => {

  const { locateLocation, restaurantData, setRestaurantData } = useContext(storeContext)
  
  const imageRef = useRef()

  const [updatedImage, setUpdatedImage] = useState('')
  const [mapPopup, setMapPopup] = useState(false)
  const [selectedCuisines, setSelectedCuisines] = useState([])
 
  const restaurantId = useSelector((state) => state.restaurant.restaurantId)

 

  const cuisineOptions = [
    "Bangladeshi",
    "Indian",
    "Chinese",
    "Thai",
    "Italian",
    "Fast Food",
    "Mexican",
    "Japanese",
    "Korean",
    "American",
    "Middle Eastern",
    "Mughlai",
    "Continental",
    "BBQ",
    "Seafood",
    "Vegan",
    "Dessert",
    "Bakery",
    "Beverages",
    "Healthy Food"
  ];




useEffect(() => {
  if (restaurantData?.cuisines?.length) {
    try {
      const parsed = Array.isArray(restaurantData.cuisines[0])
        ? restaurantData.cuisines[0]
        : JSON.parse(restaurantData.cuisines[0]);
      setSelectedCuisines(parsed);
    } catch (error) {
      console.log("Cuisine parsing error:", error);
    }
  }
}, [restaurantData]);






  const handleOnchange = (e) => {
    setRestaurantData({ ...restaurantData, [e.target.name]: e.target.value })
  }



  const handleImageOnchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedImage(
        {
          image: URL.createObjectURL(file),
          imagePath: file

        }
      )
    }
  }





  const handleUploadImage = () => {
    imageRef.current.click()
  }


  const updateRestaurantData = async () => {
    const payload = {
      ...restaurantData,
      cuisines: JSON.stringify(selectedCuisines),
      image: updatedImage.image ? updatedImage.image : restaurantData.image
    }
    try {
      const formData = new FormData()

      formData.append('restaurantId', restaurantId)
      formData.append('restaurantData', JSON.stringify(payload))
      formData.append('image', updatedImage.imagePath)

      const response = await axiosInstance.post(`/restaurant/update`, formData)
      if(response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }


  const getRestaurantData = async () => {
    try {
      const response = await axiosInstance.get(`/restaurant/details/${restaurantId}`)
      setRestaurantData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    getRestaurantData()
  }, [])

  const MapEventHandeler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setRestaurantData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }))
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          const data = await response.json()
          if (data) {
            const addr = data.address;
            const shortAddress = [addr.road, addr.quarter, addr.suburb].filter(Boolean).join(',')
            setRestaurantData((prev) => ({
              ...prev,
              address: shortAddress || '',
              city: data.address.city || data.address.town || '',
              zipcode: data.address.postcode || data.address.zipcode || ''
            }))
          }

        } catch (error) {

        }
      }
    })
  }


  // Marker icon fix
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });


  return (
    <div className='px-10 py-6 w-full h-[90vh] overflow-y-auto'>
      <p className='text-[24px] font-medium'>Add New Restauran</p>
      <div>
        <div>
          <div className='flex items-center mt-6 mb-8'>
            <GrRestaurant className='text-3xl text-orange-600' />
            <p className='text-[20px] font-medium'>Restaurant Information</p>
          </div>
          <div className='w-full flex flex-col gap-10'>
            <div className='w-full flex gap-10 justify-between'>
              <div className='flex flex-col flex-1'>
                <label htmlFor="restaurantName" className='text-[18px] font-medium text-gray-700'>Restaurant Name</label>
                <input type="text" name="restaurantName" id="restaurantName" placeholder='Enter restaurant name' value={restaurantData.restaurantName} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
              <div className='flex flex-col flex-1'>
                <label htmlFor="ownerName" className='text-[18px] font-medium text-gray-700'>Owner Name</label>
                <input type="text" name="ownerName" id="ownerName" placeholder="Enter owner's name" value={restaurantData.ownerName} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
            </div>
            <div className='w-full flex gap-10 justify-between'>
              <div className='flex flex-col flex-1'>
                <label htmlFor="email" className='text-[18px] font-medium text-gray-700'>Email Address</label>
                <input type="email" name="email" id="email" placeholder='Enter email address' value={restaurantData.email} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
              <div className='flex flex-col flex-1'>
                <label htmlFor="phone" className='text-[18px] font-medium text-gray-700'>Phone Number</label>
                <input type="text" name="phone" id="phone" placeholder="Enter phone number" value={restaurantData.phone} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
            </div>
            <div className='flex flex-col '>
              <label htmlFor="description">Description</label>
              <textarea name="description" id="description" placeholder='Enter description' value={restaurantData.description} onChange={handleOnchange} className='min-h-30 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600'></textarea>
            </div>
            <div onClick={handleUploadImage} className='w-[48%] h-50 overflow-hidden border border-gray-300 border-dashed rounded-[8px] hover:border-orange-600 flex flex-col gap-2 items-center justify-center bg-gray-100 hover:bg-orange-100 cursor-pointer'>
              <input ref={imageRef} type="file" name="image" id="image" onChange={handleImageOnchange} className='hidden' />
              {
                restaurantData.image ? (
                  <img className='w-full h-full' src={updatedImage.image || `${import.meta.env.VITE_IMAGE_BASE_URL}/images/${restaurantData.image}`} alt="" />
                ) :
                  (
                    <div className='flex flex-col items-center justify-center'>
                      <FaRegImages className='text-5xl text-gray-300' />
                      <p className='text-2xl font-medium text-orange-600'>Browse Files</p>
                    </div>
                  )
              }
            </div>
          </div>
        </div>
        <div className='mt-20'>
          <div className='flex items-center mb-6'>
            <FaLocationDot className='text-3xl text-orange-600' />
            <p className='text-[20px] font-medium'>Location Information</p>
          </div>
          <div className='w-full flex flex-col gap-10'>
            <div className='w-full flex gap-10 justify-between'>
              <div className='flex flex-col flex-1'>
                <label htmlFor="address" className='text-[18px] font-medium text-gray-700'>Address</label>
                <input type="text" name="address" id="address" placeholder='Enter full address' value={restaurantData.address} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
              <div className='flex flex-col flex-1'>
                <label htmlFor="city" className='text-[18px] font-medium text-gray-700'>City</label>
                <input type="text" name="city" id="city" placeholder="Enter city" value={restaurantData.city} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
            </div>
            <div className='w-full flex gap-10 justify-between'>
              <div className='flex flex-col flex-1'>
                <label htmlFor="zipcode" className='text-[18px] font-medium text-gray-700'>ZIP Code</label>
                <input type="text" name="zipcode" id="zipcode" placeholder='Enter restaurant name' value={restaurantData.zipcode} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
              <div className='flex flex-col flex-1'>
                <label htmlFor="deliveryRadius" className='text-[18px] font-medium text-gray-700'>Delivery Radius (km)</label>
                <input type="number" name="deliveryRadius" id="deliveryRadius" placeholder="Enter delivery redius" value={restaurantData.deliveryRadius} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
            </div>
            <div className='flex gap-10 items-center'>
              <div className='flex flex-col flex-1'>
                <label htmlFor="longitude" className='text-[18px] font-medium text-gray-700'>Longitude</label>
                <input type="text" name="longitude" id="longitude" placeholder='Enter longitude' value={restaurantData.longitude} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
              <div className='flex flex-col flex-1'>
                <label htmlFor="latitude" className='text-[18px] font-medium text-gray-700'>Latitude</label>
                <input type="text" name="latitude" id="latitude" placeholder="Enter latitude"
                 value={restaurantData.latitude} onChange={handleOnchange}
                  className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
            </div>
            <div className='flex gap-10 items-center'>
              <button onClick={locateLocation} className='flex items-center gap-1.5 rounded px-4 py-2 bg-orange-600 text-white cursor-pointer'><LuLocateFixed className='text-2xl' /> Use My Location</button>
              <button onClick={() => setMapPopup(true)} className='px-4 py-2 rounded bg-gray-700 text-white'>Choice From Map</button>
            </div>
          </div>
        </div>
        <div className='mt-20'>
          <div className='flex items-center mb-6'>
            <MdRestaurant className='text-3xl text-orange-600' />
            <p className='text-[20px] font-medium'>Cuisine & Details</p>
          </div>
          <div className='w-full flex flex-col gap-10'>
            <div className='w-full flex gap-10 justify-between'>
              <div className='flex flex-col flex-1'>
                <label htmlFor="cuisine" lassName='text-[18px] font-medium text-gray-700'>Cuisine</label>
                <div name="cuisine" id="cuisine" className='flex flex-wrap gap-3'>
                  {
                    cuisineOptions.map((cuisine, index) => (
                      <div key={index} className='flex items-center gap-1 px-3 py-1.5 rounded-[25%] border border-gray-300 hover:border-orange-600'>
                        <input
                          type="checkbox"
                          name="cuisines"
                          id=""
                          value={cuisine}
                          onChange={(e) => {
                            const value = e.target.value;
                            let updateCuisines = [...selectedCuisines]

                            if (updateCuisines.includes(value)) {
                              updateCuisines = updateCuisines.filter(key => key != value)
                            } else {
                              updateCuisines.push(value)
                            }
                            setSelectedCuisines(updateCuisines)
                          }}
                          checked={selectedCuisines.includes(cuisine)}
                        />
                        {cuisine}
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className='w-full flex gap-10 justify-between'>
              <div className='flex flex-col flex-1'>
                <label htmlFor="deliveryTime" className='text-[18px] font-medium text-gray-700'>Delivery Time</label>
                <input type="text" name="deliveryTime" id="deliveryTime" placeholder="Enter delivery time" value={restaurantData.deliveryTime} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
              <div className='flex flex-col flex-1'>
                <label htmlFor="deliveryFee" className='text-[18px] font-medium text-gray-700'>Delivery Fee</label>
                <input type="text" name="deliveryFee" id="deliveryFee" placeholder="Enter delivery fee" value={restaurantData.deliveryFee} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
            </div>
            <div className='w-full flex gap-10 justify-between'>
              <div className='flex flex-col flex-1'>
                <label htmlFor="openingTime">Restaurant Open</label>
                <input type="text" name="openingTime" id="openingTime" placeholder="Enter opening time" value={restaurantData.openingTime} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
              <div className='flex flex-col flex-1'>
                <label htmlFor="closingTime">Restaurant Close</label>
                <input type="text" name="closingTime" id="closingTime" placeholder="Enter close time" value={restaurantData.closingTime} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600' />
              </div>
            </div>
            <div className='flex flex-col flex-1'>
              <label htmlFor="status" className='text-[18px] font-medium text-gray-700'>Staus</label>
              <select name="status" id="status" value={restaurantData.status} onChange={handleOnchange} className='h-14 px-4 py-2 outline-0 border border-gray-300 hover:border-orange-600'>
                <option value="" className='hidden'>Select any one</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-10 mt-16'>
          <button className='w-45 h-12 text-[18px] rounded bg-gray-800 text-white cursor-pointer'>Cancle</button>
          <button onClick={updateRestaurantData} className='w-45 h-12 text-[18px] rounded bg-orange-600 text-white cursor-pointer'>Update Restaurant</button>
        </div>
        <div className='absolute top-slide top-25 w-200 h-auto px-2 bg-gray-100 flex flex-col'>
          {mapPopup &&

            <div>
              <button onClick={() => setMapPopup(false)} className='ml-[95%] mt-2 mb-2 text-4xl font-medium cursor-pointer'>x</button>

              <MapContainer center={[23.8103, 90.4125]} zoom={13} className="w-full h-96 relative z-0">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[restaurantData.latitude || 23.8103, restaurantData.longitude || 90.4125]} />
                <MapEventHandeler />
              </MapContainer>
            </div>

          }
        </div>
      </div>
    </div>
  )
}

export default RestaurantUpadte


