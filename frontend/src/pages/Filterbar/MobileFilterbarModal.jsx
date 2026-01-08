import React from 'react'
import { IoCloseOutline } from "react-icons/io5";
import { useContext } from 'react'
import { storeContext } from '../../Context/Context'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';

const MobileFilterbarModal = ({ setShowFilteredRestaurant }) => {
  const { setIsMobileFilterbarModal, setRestaurants } = useContext(storeContext)

  const [filters, setFilters] = useState({
    sortBy: "relevance",
    cuisine: "",
    rating: "",
    priceOrder: "",
  });


  const [apiFilters, setApiFilters] = useState({});

  const [cuisineQueryKeyword, setCuisineQueryKeyword] = useState('');
  const [showCuisine, setShowCuisine] = useState(8);

  const asianCuisines = [
    "Bangladeshi", "Indian", "Pakistani", "Chinese", "Thai", "Japanese",
    "Korean", "Vietnamese", "Malaysian", "Indonesian", "Sri Lankan",
    "Nepali", "Burmese", "buna", "baja", "cha", "chomcha", "chicken",
    "dhaka briyani", "dhaka puchka house", "breackfast", "rute", "salad", "nasta"
  ];

  // Update Filter
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? "" : value
    }));

    setApiFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? "" : value
    }));
  };

  // Clear All
  const clearFilter = () => {
    setFilters({
      sortBy: "relevance",
      cuisine: "",
      rating: "",
      priceOrder: ""
    });

    setApiFilters({});
    setCuisineQueryKeyword("");
  };

  const userData = useSelector((state) => state.user.userData);

  // store user location from localStorage
  const userLocation = JSON.parse(localStorage.getItem('defaultLocation'))
  
  const getRestaurants = async () => {
    // const userLat = userData?.address?.[0]?.location?.coordinates?.[1];
    // const userLng = userData?.address?.[0]?.location?.coordinates?.[0];

    const userLat = userLocation?.lat;
    const userLng = userLocation?.lon;

    let query = new URLSearchParams();

    if (apiFilters.sortBy) query.append('sortBy', apiFilters.sortBy);
    if (apiFilters.cuisine) query.append('cuisine', apiFilters.cuisine);
    if (apiFilters.rating) query.append('rating', apiFilters.rating);
    if (apiFilters.priceOrder) query.append('priceOrder', apiFilters.priceOrder);
    if (userLat) query.append('lat', userLat);
    if (userLng) query.append('lng', userLng);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/restaurant/search?${query.toString()}`
      );

      if (response.data.message) {
        setRestaurants(response.data.data)
        setShowFilteredRestaurant(true)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setApiFilters({});
    }
  };


  // CALL API 
  // useEffect(() => {
  //   if (apiFilters.sortBy || apiFilters.cuisine || apiFilters.rating || apiFilters.priceOrder) {
  //     getRestaurants();
  //   }
  // }, [apiFilters]);


  // Cuisine search logic
  const cuisineBySearch = cuisineQueryKeyword === ""
    ? []
    : asianCuisines.filter(keyword =>
      keyword.toLowerCase().startsWith(cuisineQueryKeyword.toLowerCase())
    );



  return (
    <div className='fixed top-0 left-0 w-full h-[100vh] pb-50 overflow-y-auto bg-white z-30 p-6 xl:hidden'>
      <div className='w-full flex justify-between items-center font-semibold text-gray-700'>
        <p className='text-2xl'>Filters</p>
        <IoCloseOutline
          onClick={() => setIsMobileFilterbarModal(false)}
          className='text-3xl cursor-pointer'
        />
      </div>

      {/* Sort By */}
      <div className='mt-8'>
        <h1 className='font-medium text-gray-700 pb-1 text-[18px] border-b border-gray-200'>Sort By</h1>

        <div className='grid grid-cols-2 mt-4'>
          <label className='flex gap-1.5 py-1.5 items-center cursor-pointer text-[15px]'>
            <input
              type="radio"
              checked={filters.sortBy === "relevance"}
              onClick={() => updateFilter("sortBy", "relevance")}
              className='w-4.5 h-4.5 accent-orange-600'
            />
            Relevance
          </label>

          <label className='flex gap-1.5 py-1.5 items-center cursor-pointer text-[15px]'>
            <input
              type="radio"
              checked={filters.sortBy === "rating"}
              onClick={() => updateFilter("sortBy", "rating")}
              className='w-4.5 h-4.5 accent-orange-600'
            />
            Top Rated
          </label>

          <label className='flex gap-1.5 py-1.5 items-center cursor-pointer text-[15px]'>
            <input
              type="radio"
              checked={filters.sortBy === "distance"}
              onClick={() => updateFilter("sortBy", "distance")}
              className='w-4.5 h-4.5 accent-orange-600'
            />
            Distance
          </label>

          <label className='flex gap-1.5 py-1.5 items-center cursor-pointer text-[15px]'>
            <input
              type="radio"
              checked={filters.sortBy === "delivery"}
              onClick={() => updateFilter("sortBy", "delivery")}
              className='w-4.5 h-4.5 accent-orange-600'
            />
            Faster Delivery
          </label>
        </div>
      </div>


      {/* Quick Filters */}
      <div className='pt-4'>
        <h1 className='font-medium text-[18px] text-gray-700 mt-2 pb-1 border-b border-gray-200'>
          Quick Filters
        </h1>

        <div className='flex items-start gap-3 text-[15px] mt-8 font-medium text-gray-700'>
          <button
            onClick={() => updateFilter("rating", "4")}
            className='px-2.5 py-1 rounded-2xl cursor-pointer border border-gray-300 hover:bg-gray-100'>
            Ratings 4+
          </button>

          <button
            onClick={() => updateFilter("priceOrder", "highToLow")}
            className='px-2.5 py-1 rounded-2xl cursor-pointer border border-gray-300 hover:bg-gray-100'>
            High to Low Price
          </button>

          <button
            onClick={() => updateFilter("priceOrder", "lowToHigh")}
            className='px-2.5 py-1 rounded-2xl cursor-pointer border border-gray-300 hover:bg-gray-100'>
            Low to High Price
          </button>
        </div>
      </div>


      {/* Cuisine Filter */}
      <div className='pt-5 '>
        <h1 className='font-medium text-[18px] text-gray-700 pb-4 mt-2'>
          Cuisines (Asia)
        </h1>

        <input
          type="search"
          placeholder='Search for cuisine'
          value={cuisineQueryKeyword}
          onChange={(e) => setCuisineQueryKeyword(e.target.value)}
          className='w-[90%] h-12 bg-gray-100 rounded-2xl px-4 border border-gray-400 mb-8'
        />

        {cuisineQueryKeyword && cuisineBySearch.length === 0 && (
          <div className='text-center'>
            <p className="text-[17px] font-bold mb-2">
              Result not found for "{cuisineQueryKeyword}"
            </p>
            <p className='text-[15px] font-medium'>
              Try searching something else
            </p>
          </div>
        )}

        <div className='grid grid-cols-2'>
          {(cuisineQueryKeyword ? cuisineBySearch : asianCuisines.slice(0, showCuisine))
            .map((cuisine, index) => (
              <label key={index} className='flex gap-1.5 py-1.5 items-center cursor-pointer text-[15px]'>

                <input
                  type="checkbox"
                  checked={filters.cuisine === cuisine}
                  onClick={() => updateFilter("cuisine", cuisine)}
                  className='w-4 h-4 accent-orange-600'
                />

                {cuisine}
              </label>
            ))}

          <div>
            {!cuisineQueryKeyword && (
              showCuisine < asianCuisines.length ? (
                <button
                  onClick={() => setShowCuisine(showCuisine + 8)}
                  className='text-blue-500 mt-2'>
                  Show more
                </button>
              ) : (
                <button
                  onClick={() => setShowCuisine(8)}
                  className='text-blue-500 mt-2'>
                  Show less
                </button>
              )
            )}
          </div>
        </div>

      </div>

      <div className='w-full px-4 h-40 fixed flex flex-col gap-4 justify-center items-center left-0 bottom-0 bg-white border-t border-gray-200'>
        <button onClick={() => { getRestaurants(); setIsMobileFilterbarModal(false) }} className='w-full h-14 rounded-2xl bg-orange-600 font-semibold cursor-pointer text-white'>Apply</button>
        <button onClick={clearFilter} className='w-full h-14 rounded-2xl border border-gray-400 font-semibold cursor-pointer text-gray-700'>Clear All</button>
      </div>
    </div>
  )
}

export default MobileFilterbarModal