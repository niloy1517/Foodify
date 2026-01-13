import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { storeContext } from '../../Context/Context';
import { useContext } from 'react';
import { useLocationRestaurants } from '../../Hooks/useLocationRestaurants';
import { restaurantService } from '../../Services/restaurant.service';

const DesktopFilterbar = ({ setShowFilteredRestaurants }) => {
    const { setRestaurants, filters, setFilters, updateFilter, getFilteredRestaurants, clearFilter } = useContext(storeContext)





    const [cuisineQueryKeyword, setCuisineQueryKeyword] = useState('');
    const [showCuisine, setShowCuisine] = useState(10);

    const asianCuisines = [
        "Bangladeshi", "Indian", "Pakistani", "Chinese", "Thai", "Japanese",
        "Korean", "Vietnamese", "Malaysian", "Indonesian", "Sri Lankan",
        "Nepali", "Burmese", "buna", "baja", "cha", "chomcha", "chicken",
        "dhaka briyani", "dhaka puchka house", "breackfast", "rute", "salad", "nasta"
    ];



    const userLocation = localStorage.getItem('defaultLocation')



    // const getRestaurants = async () => {

    //     const userLat = userLocation?.lat;
    //     const userLng = userLocation?.lon;

    //     let query = new URLSearchParams();

    //     if (filters.sortBy) query.append('sortBy', filters.sortBy);
    //     if (filters.cuisine) query.append('cuisine', filters.cuisine);
    //     if (filters.rating) query.append('rating', filters.rating);
    //     if (filters.priceOrder) query.append('priceOrder', filters.priceOrder);
    //     if (userLat) query.append('lat', userLat);
    //     if (userLng) query.append('lng', userLng);

    //     try {
    //         const response = await axios.get(
    //             `http://localhost:5000/api/restaurant/search?${query.toString()}`
    //         );

    //         if (response.data.message) {
    //             setRestaurants(response.data.data)
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    useEffect(() => {
        getFilteredRestaurants()
    }, [filters])


    // Cuisine search logic
    const cuisineBySearch = cuisineQueryKeyword === ""
        ? []
        : asianCuisines.filter(keyword =>
            keyword.toLowerCase().startsWith(cuisineQueryKeyword.toLowerCase())
        );

    const showClearFilterBtn = Object.values(filters).filter(f => f !== '').length;


    return (
        <div className='flex flex-col leftside-filter-section flex-1/4 w-74 h-[80vh] border-1 border-gray-200 px-4 overflow-y-scroll shadow-2xl mt-20'>

            {/* Header */}
            <div className='w-full flex justify-between items-center py-5'>
                <p className='text-2xl font-medium text-gray-700'>Filters</p>
                {
                    showClearFilterBtn > 0 &&
                    <button
                        onClick={() => {
                            clearFilter();
                            setCuisineQueryKeyword("");
                        }}
                        className='text-[12px] w-18 h-6 bg-gray-100 rounded-4xl cursor-pointer text-gray-700 font-medium'
                    >
                        Clear All
                    </button>
                }
            </div>

            {/* Sort By */}
            <div>
                <h1 className='font-medium text-gray-700 pb-4 text-[18px]'>Sort By</h1>

                <label className='flex gap-1.5 py-1.5 items-center cursor-pointer text-[15px]'>
                    <input
                        type="radio"
                        checked={filters.sortBy === "topRated"}
                        onClick={() => {
                            filters.sortBy === 'topRated' ? updateFilter("sortBy", "") : updateFilter("sortBy", "topRated");
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
                        onClick={() => {
                            filters.sortBy === 'distance' ? updateFilter("sortBy", "") : updateFilter("sortBy", "distance");
                            setShowFilteredRestaurants(true)

                        }}
                        className='w-4.5 h-4.5 accent-black'
                    />
                    Distance
                </label>

                <label className='flex gap-1.5 py-1.5 items-center cursor-pointer text-[15px]'>
                    <input
                        type="radio"
                        checked={filters.sortBy === "delivery"}
                        onClick={() => {
                            filters.sortBy === 'delivery' ? updateFilter("sortBy", "") : updateFilter("sortBy", "delivery");
                            setShowFilteredRestaurants(true)
                        }}
                        className='w-4.5 h-4.5 accent-black'
                    />
                    Faster Delivery
                </label>
            </div>

            {/* Quick Filters */}
            <div className='pt-4'>
                <h1 className='font-medium text-[18px] text-gray-700 pb-4 mt-2'>
                    Quick Filters
                </h1>

                <div className='flex flex-col items-start gap-3 text-[15px] font-medium text-gray-700'>
                    <button
                        onClick={() => {
                            filters.rating ? updateFilter("rating", "") : updateFilter("rating", "4");
                            setShowFilteredRestaurants(true)
                        }}
                        className={`${filters.rating ? 'bg-black text-white border' : ''} px-2.5 py-1 rounded-2xl cursor-pointer border border-gray-300`}>
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
            <div className='pt-5'>
                <h1 className='font-medium text-[18px] text-gray-700 pb-4 mt-2'>
                    Cuisines (Asia)
                </h1>

                <input
                    type="search"
                    placeholder='Search for cuisine'
                    value={cuisineQueryKeyword}
                    onChange={(e) => setCuisineQueryKeyword(e.target.value)}
                    className='w-[90%] h-8 bg-gray-100 rounded-2xl px-4 border border-gray-400 mb-8'
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

                <div>
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

                    {!cuisineQueryKeyword && (
                        showCuisine < asianCuisines.length ? (
                            <button
                                onClick={() => setShowCuisine(showCuisine + 10)}
                                className='text-blue-500 mt-2'>
                                Show more
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowCuisine(10)}
                                className='text-blue-500 mt-2'>
                                Show less
                            </button>
                        )
                    )}
                </div>

            </div>
        </div>
    );
};

export default DesktopFilterbar;
