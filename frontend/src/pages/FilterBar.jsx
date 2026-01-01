import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { storeContext } from '../Context/Context';
import { useContext } from 'react';

const FilterBar = ({ setShowFilteredRestaurant }) => {
    const { setSearchRestaurants } = useContext(storeContext)

    const [filters, setFilters] = useState({
        sortBy: "",
        cuisine: "",
        rating: "",
        priceOrder: "",
    });

    const [apiFilters, setApiFilters] = useState({});

    const [cuisineQueryKeyword, setCuisineQueryKeyword] = useState('');
    const [showCuisine, setShowCuisine] = useState(10);

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
            sortBy: "",
            cuisine: "",
            rating: "",
            priceOrder: ""
        });

        setApiFilters({});
        setCuisineQueryKeyword("");
    };

    const userData = useSelector((state) => state.user.userData);

    const getRestaurants = async () => {
        const userLat = userData?.address?.[0]?.location?.coordinates?.[1];
        const userLng = userData?.address?.[0]?.location?.coordinates?.[0];

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
                setSearchRestaurants(response.data.data)
                setShowFilteredRestaurant(true)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setApiFilters({});
        }
    };


    // CALL API 
    useEffect(() => {
        if (apiFilters.sortBy || apiFilters.cuisine || apiFilters.rating || apiFilters.priceOrder) {
            getRestaurants();
        }
    }, [apiFilters]);


    // Cuisine search logic
    const cuisineBySearch = cuisineQueryKeyword === ""
        ? []
        : asianCuisines.filter(keyword =>
            keyword.toLowerCase().startsWith(cuisineQueryKeyword.toLowerCase())
        );

    const showClearFilterBtn =
        filters.sortBy !== "" ||
        filters.cuisine !== "" ||
        filters.rating !== "" ||
        filters.priceOrder !== "";


    return (
        <div className='hidden xl:flex flex-col leftside-filter-section flex-1/4 w-65 h-[80vh] border-1 border-gray-200 px-4 overflow-y-scroll shadow-2xl mt-6'>

            {/* Header */}
            <div className='flex justify-between items-center py-5'>
                <h1 className='text-2xl font-medium text-gray-700'>Filters</h1>

                {showClearFilterBtn && (
                    <button
                        onClick={clearFilter}
                        className='text-[12px] w-18 h-6 bg-gray-100 rounded-4xl cursor-pointer text-gray-700 font-medium'>
                        Clear All
                    </button>
                )}
            </div>

            {/* Sort By */}
            <div>
                <h1 className='font-medium text-gray-700 pb-4 text-[18px]'>Sort By</h1>

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

            {/* Quick Filters */}
            <div className='pt-4'>
                <h1 className='font-medium text-[18px] text-gray-700 pb-4 mt-2'>
                    Quick Filters
                </h1>

                <div className='flex flex-col items-start gap-3 text-[15px] font-medium text-gray-700'>
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
                                    onClick={() => updateFilter("cuisine", cuisine)}
                                    className='w-4 h-4 accent-orange-600'
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

export default FilterBar;
