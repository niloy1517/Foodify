import React from 'react'
import { IoCloseOutline } from "react-icons/io5";
import { useContext } from 'react'
import { storeContext } from '../../Context/Context'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MobileFilterbarModal = ({ setShowFilteredRestaurants, setIsFiltered }) => {
  const { setIsMobileFilterbarModal, filters, updateFilter, getFilteredRestaurants, clearFilter } = useContext(storeContext)


  
  const [showCuisine, setShowCuisine] = useState(8);
  const [cuisineQueryKeyword, setCuisineQueryKeyword] = useState('')


  const asianCuisines = [
    "Bangladeshi", "Indian", "Pakistani", "Chinese", "Thai", "Japanese",
    "Korean", "Vietnamese", "Malaysian", "Indonesian", "Sri Lankan",
    "Nepali", "Burmese", "buna", "baja", "cha", "chomcha", "chicken",
    "dhaka briyani", "dhaka puchka house", "breackfast", "rute", "salad", "nasta"
  ];


  // Cuisine search logic
  const keyword = cuisineQueryKeyword.trim().toLowerCase();
  const cuisineBySearch = keyword ? 
    asianCuisines.filter(item =>
      item.toLowerCase().includes(keyword)
    ) : [];


  const navigate = useNavigate()  

  return (
    <div className='fixed top-0 left-0 w-full h-[100vh] pb-50 overflow-y-auto bg-white z-30 p-6 xl:hidden'>
      <div className='w-full flex justify-between items-center font-semibold text-gray-700'>
        <p className='text-2xl'>Filters</p>
        <IoCloseOutline
          onClick={() => {
            setIsMobileFilterbarModal(false);
            clearFilter();
            setCuisineQueryKeyword("");
          }}
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
              checked={filters.sortBy === ""}
              onClick={() => updateFilter("sortBy", "")}
              className='w-4.5 h-4.5 accent-black'
            />
            Relevance
          </label>

          <label className='flex gap-1.5 py-1.5 items-center cursor-pointer text-[15px]'>
            <input
              type="radio"
              checked={filters.sortBy === "topRated"}
              onClick={() => {
                updateFilter("sortBy", "topRated");
                setShowFilteredRestaurants(true)
              }}
              className='w-4.5 h-4.5 accent-black'
            />
            Top Rated
          </label>

          <label className='flex gap-1.5 py-1.5 items-center cursor-pointer text-[15px]'>
            <input
              type="radio"
              checked={filters.sortBy === "distance"}
              onClick={() => updateFilter("sortBy", "distance")}
              className='w-4.5 h-4.5 accent-black'
            />
            Distance
          </label>

          <label className='flex gap-1.5 py-1.5 items-center cursor-pointer text-[15px]'>
            <input
              type="radio"
              checked={filters.sortBy === "delivery"}
              onClick={() => {
                updateFilter("sortBy", "delivery");
                setShowFilteredRestaurants(true)
              }}
              className='w-4.5 h-4.5 accent-black'
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
            onClick={() => {
              filters.rating ? updateFilter("rating", "") : updateFilter("rating", "4");
              setShowFilteredRestaurants(true);
            }}
            className={`${filters.rating ? 'bg-black text-white border-0' : ''} px-2.5 py-1 rounded-2xl cursor-pointer border border-gray-300`}>
            Ratings 4+
          </button>

          <button
            onClick={() => {
              filters.priceOrder === 'highToLow' ? updateFilter("priceOrder", "") : updateFilter("priceOrder", "highToLow");
              setShowFilteredRestaurants(true)
            }}
            className={`${filters.priceOrder === 'highToLow' ? 'bg-black text-white border-0' : ''} px-2.5 py-1 rounded-2xl cursor-pointer border border-gray-300`}>
            High to Low Price
          </button>

          <button
            onClick={() => {
              filters.priceOrder === 'lowToHigh' ? updateFilter("priceOrder", "") : updateFilter("priceOrder", "lowToHigh");
              setShowFilteredRestaurants(true)
            }}
            className={`${filters.priceOrder === 'lowToHigh' ? 'bg-black text-white border-0' : ''} px-2.5 py-1 rounded-2xl cursor-pointer border border-gray-300`}>
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
                  onClick={() => {
                    filters.cuisine === cuisine ? updateFilter("cuisine", '') : updateFilter("cuisine", cuisine);
                    setShowFilteredRestaurants(true)
                  }}
                  className='w-4 h-4 accent-black'
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
        <button onClick={() => {
          getFilteredRestaurants();
          setIsMobileFilterbarModal(false);
          setIsFiltered(true);
          
        }} className='w-full h-14 rounded-2xl bg-orange-600 font-semibold cursor-pointer text-white'>Apply</button>
        <button onClick={() => {
          clearFilter();
          setIsMobileFilterbarModal(false);
          setCuisineQueryKeyword("");
        }} className='w-full h-14 rounded-2xl border border-gray-400 font-semibold cursor-pointer text-gray-700'>Clear All</button>
      </div>
    </div>
  )
}

export default MobileFilterbarModal