import React, { useEffect, useRef, useState } from 'react';
import { GoArrowUpLeft, GoSearch } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { PiClockCounterClockwise } from "react-icons/pi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { RiSearchLine } from "react-icons/ri";
import { useContext } from 'react';
import { storeContext } from '../Context/Context';
import { useLocationRestaurants } from '../Hooks/useLocationRestaurants';
import { restaurantService } from '../Services/restaurant.service';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { axiosInstance } from '../Api/axiosInstance';

const SearchBar = ({ setHideDesktopFilterbar, setHideMainContent }) => {
    const { setRestaurants, setIsMobileFilterbarModal, isOverlay, setIsOverlay, filters, clearFilter } = useContext(storeContext);

    const { setCoordinates } = useLocationRestaurants()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()


    const [suggestKeywordPopup, setSuggestKeywordPopup] = useState(false);
    const [suggestKeywordBySearchPopup, setSuggestKeywordBySearchPopup] = useState(false);
    const [recentSearchKeyword, setRecentSearchKeyword] = useState([]);
    const [recentKeywordPopup, setRecentKeywordPopup] = useState(false);
    const [queryKeyword, setQueryKeyword] = useState(() => {
        const saved = localStorage.getItem('searchKeyword')
        return saved ? JSON.parse(saved) : ''
    });

    const [searchKeywords, setSearchKeywords] = useState([])



    const inputRef = useRef(null);
    const recentPopupRef = useRef(null);
    const popularPopupRef = useRef(null);
    const searchByKeywordRef = useRef(null);


    const popularSearches = [
        "Pizza", "Burger", "Biryani", "Fried Chicken", "Sushi"
    ];



    // Store user location from localStorage
    const userLocation = JSON.parse(localStorage.getItem('defaultLocation'))

    // Store search keyword in localStorage

    useEffect(() => {
        const searchQuery = searchParams.get('query')
        console.log(searchQuery, 'search')
        localStorage.setItem('searchKeyword', JSON.stringify(queryKeyword))
    }, [queryKeyword])


    const saved = JSON.parse(localStorage.getItem('searchKeyword'))


    useEffect(() => {
        if (!queryKeyword || queryKeyword === '') return

        const getRestaurantsBySearch = async () => {
            let query = new URLSearchParams({
                searchKeyword: queryKeyword,
                lat: userLocation.lat,
                lng: userLocation.lon,
            })
            try {
                const response = await axiosInstance.get(`/restaurant/search?${query.toString()}`)
                if (response.data.message) {
                    setRestaurants(response.data.data)
                }
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
        
        getRestaurantsBySearch()
    }, [queryKeyword])

    const filterCounter = Object.values(filters).filter(f => f !== '').length;






    // Delete filtered or search restaurants using this function  
    const deleteFilterdRestaurants = () => {
        setCoordinates({
            lat: userLocation.lat,
            lng: userLocation.lon
        })
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            const inputClicked = inputRef.current && inputRef.current.contains(event.target);
            const popupClicked =
                (recentPopupRef.current && recentPopupRef.current.contains(event.target)) ||
                (popularPopupRef.current && popularPopupRef.current.contains(event.target)) ||
                (searchByKeywordRef.current && searchByKeywordRef.current.contains(event.target));

            if (!inputClicked && !popupClicked) {
                setSuggestKeywordPopup(false);
                setRecentKeywordPopup(false);
                setSuggestKeywordBySearchPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOnchange = (e) => {
        setQueryKeyword(e.target.value);
        setSuggestKeywordBySearchPopup(true);
    };

    const suggestkeyworyBySearch = queryKeyword === ''
        ? []
        : searchKeywords?.filter(keyword =>
            keyword.toLowerCase().includes(queryKeyword.toLowerCase())
        );

    const handleRecentSearchKeywordAdd = (keyword) => {
        setRecentSearchKeyword(prev => {
            const filtered = prev.filter(item => item !== keyword);
            return [keyword, ...filtered];
        });
    };

    const handleRecentSearchKeywordDel = (key) => {
        const keyword = recentSearchKeyword?.filter(keyword => keyword !== key);
        setRecentSearchKeyword(keyword);
    };


    useEffect(() => {
        const getAllrestaurants = async () => {
            try {
                const response = await restaurantService.getAllRestaurantsName();

                setSearchKeywords(prev => {
                    const parsed = response.data.data.map(res => res.cuisines)
                    const cuisines = parsed.flatMap(item => item)

                    const margedKeyword = [
                        ...prev,
                        response.data.data.map(res => res.restaurantName),
                        cuisines.map(cui => cui)
                    ].flat()
                    return [...new Set(margedKeyword)]
                })
            } catch (error) {
                console.log(error)
            }
        }

        const getAllFoods = async () => {
            try {
                const response = await restaurantService.getAllFoods();
                setSearchKeywords(prev => {
                    const margedKeyword = [
                        ...prev,
                        response.data.data.map(res => res.foodName),
                    ].flat()
                    return [...new Set(margedKeyword)]
                })
            } catch (error) {
                console.log(error)
            }
        }

        getAllrestaurants()
        getAllFoods()
    }, [])


    



    const baseUrl = `/restaurants/new?lat=${userLocation?.lat}&lng=${userLocation?.lon}`;
    const handleNavigate = (keyword) => {
        const queryString = new URLSearchParams({ 'query': keyword }).toString()
        navigate(queryString ? `${baseUrl}&${queryString}` : baseUrl, { replace: true })
    }


    return (
        <div className={`w-full relative px-4 md:px-8 xl:px-14`}>
            <div onClick={(e) => e.stopPropagation()} className=''>
                <div className='w-full lg:max-w-[800px] flex items-center pt-6 gap-4 text-gray-700'>
                    {
                        filterCounter === 0 &&
                        <div className='w-full h-16 md:h-18 flex items-center lg:text-[18px] px-3 rounded-3xl bg-gray-100'>
                            <RiSearchLine className='text-2xl' />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder='Search for restaurant, cuisines and dishes'
                                onClick={() => {
                                    setSuggestKeywordPopup(true);
                                    setRecentKeywordPopup(true);
                                    setIsOverlay(true)
                                }}
                                onChange={handleOnchange}
                                value={queryKeyword}
                                className='w-full h-full outline-none px-2 '
                            />
                            <div>
                                {
                                    queryKeyword?.length > 0 &&
                                    <RxCross2 onClick={() => {
                                        deleteFilterdRestaurants();
                                        setIsOverlay(false);
                                        setQueryKeyword('');
                                        handleNavigate('');
                                        setHideDesktopFilterbar(false);
                                        setHideMainContent(false);
                                    }}
                                        className='cursor-pointer' />
                                }
                            </div>
                        </div>
                    }
                    {
                        !isOverlay && queryKeyword?.length === 0 &&
                        <div className={`${filterCounter > 0 && 'w-full'}`}>
                            {
                                filterCounter > 0 ?
                                    <div className='w-full hover:bg-orange-100 transform transition-transform duration-500 select-none h-16 bg-white flex xl:hidden items-center justify-between gap-2 font-semibold text-gray-600 border border-gray-200 px-3 rounded-3xl cursor-pointer'>
                                        <div onClick={() => setIsMobileFilterbarModal(true)} className='flex items-center relative'>
                                            <HiAdjustmentsHorizontal className='relative text-[24px] md:text-2xl' />
                                            <span className='absolute left-3 top-2 text-sm bg-orange-600 size-4.5 text-white flex items-center justify-center rounded-full'>{filterCounter}</span>
                                            <span className='pl-1'>Filters: {filters.sortBy === 'topRated' && 'Top Rated,' || filters.sortBy === 'delivery' && 'Faster delivery,'} {filters.rating && 'Rating 4+'}</span>
                                        </div>
                                        <div className='size-8 rounded-full hover:bg-white flex items-center justify-center'>
                                            <RxCross2 onClick={() => { clearFilter(); handleNavigate() }} className='text-2xl cursor-pointer' />
                                        </div>
                                    </div>
                                    :
                                    <div onClick={() => setIsMobileFilterbarModal(true)} className='select-none h-16 bg-white flex xl:hidden items-center gap-2 font-semibold text-gray-600 border border-gray-200 px-3 rounded-3xl cursor-pointer'>
                                        <HiAdjustmentsHorizontal className='text-[20px] md:text-2xl' />
                                        <span>Filter</span>
                                    </div>
                            }
                        </div>
                    }
                </div>


                <div className='w-[95%] md:w-[92%] lg:max-w-[800px] fixed'>
                    {/* Recent & Popular Popups */}
                    <div ref={recentPopupRef} className='w-full z-10'>
                        {!queryKeyword && recentKeywordPopup &&
                            <div className='w-full mt-2 bg-white shadow-2xl rounded-[8px] flex-wrap py-4'>
                                {recentSearchKeyword.length > 0 && (
                                    <div className='w-full py-2.5 px-6 mb-6'>
                                        <h1 className='font-bold text-[18px] pb-2 text-gray-900'>Recent search</h1>
                                        <div className='w-full flex flex-col gap-2'>
                                            {recentSearchKeyword.slice(0, 4).map((searchKeyword, index) => (
                                                <div key={index} className='w-full flex items-center justify-between'>
                                                    <button
                                                        className='w-full rounded-2xl flex items-center gap-1 py-1 mt-2 cursor-pointer'
                                                        onClick={() => {
                                                            setIsOverlay(false);
                                                            setQueryKeyword(searchKeyword);
                                                            setSuggestKeywordBySearchPopup(false);
                                                            handleRecentSearchKeywordAdd(searchKeyword);
                                                            handleNavigate(searchKeyword);
                                                            setHideDesktopFilterbar(true);
                                                            setHideMainContent(true);
                                                        }}
                                                    >
                                                        <PiClockCounterClockwise className='text-[24px]' /> {searchKeyword}
                                                    </button>
                                                    <button className='text-[18px] cursor-pointer' onClick={() => { handleRecentSearchKeywordDel(searchKeyword); setIsOverlay(true) }}>
                                                        <RxCross2 />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {suggestKeywordPopup && (
                                    <div ref={popularPopupRef} className='px-4'>
                                        <h1 className='font-bold text-[18px] p-2.5 text-gray-900'>Popular dishes</h1>
                                        {popularSearches.map((searchKeyword, index) => (
                                            <button
                                                key={index}
                                                className='px-3 py-1 m-2 border border-gray-300 text-[15px] cursor-pointer rounded-2xl'
                                                onClick={() => {
                                                    setQueryKeyword(searchKeyword);
                                                    setSuggestKeywordPopup(false);
                                                    handleRecentSearchKeywordAdd(searchKeyword);
                                                    setSuggestKeywordBySearchPopup(false);
                                                    setIsOverlay(false);
                                                    handleNavigate(searchKeyword);
                                                    setHideDesktopFilterbar(true);
                                                    setHideMainContent(true);
                                                }}>
                                                {searchKeyword}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        }
                    </div>

                    {/* Search By Keyword Popup */}
                    <div ref={searchByKeywordRef} className=' relative z-10 bg-white text-gray-600 mt-2 rounded-2xl overflow-hidden'>
                        {suggestKeywordBySearchPopup && (
                            <div onClick={() => setIsOverlay(false)} className=''>
                                {suggestkeyworyBySearch.map((searchKeyword, index) => (
                                    <button
                                        key={index}
                                        className='w-full h-10 flex justify-between items-center cursor-pointer mt-2 px-4 hover:bg-gray-100'
                                        onClick={() => {
                                            setQueryKeyword(searchKeyword);
                                            setSuggestKeywordBySearchPopup(false);
                                            handleRecentSearchKeywordAdd(searchKeyword);
                                            handleNavigate(searchKeyword);
                                            setIsOverlay(false);
                                            setHideDesktopFilterbar(true);
                                            setHideMainContent(true)
                                        }}
                                    >
                                        <span className='flex gap-2 items-center'><GoSearch className='text-2xl' /> {searchKeyword}</span>
                                        <GoArrowUpLeft className='text-2xl' />
                                    </button>
                                ))}
                                {queryKeyword && <p className='w-full px-4 py-4'>Search for "{queryKeyword}"</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
