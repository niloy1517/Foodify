import React, { useEffect, useRef, useState } from 'react';
import { GoArrowUpLeft, GoSearch } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { PiClockCounterClockwise } from "react-icons/pi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useContext } from 'react';
import { storeContext } from '../Context/Context';

const SearchBar = ({ setShowFilteredRestaurant }) => {
    const { searchRestaurants, setSearchRestaurants, setIsMobileFilterbarModal } = useContext(storeContext)

    const [suggestKeywordPopup, setSuggestKeywordPopup] = useState(false);
    const [suggestKeywordBySearchPopup, setSuggestKeywordBySearchPopup] = useState(false);
    const [recentSearchKeyword, setRecentSearchKeyword] = useState([]);
    const [recentKeywordPopup, setRecentKeywordPopup] = useState(false);
    const [queryKeyword, setQueryKeyword] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);

    const inputRef = useRef(null);
    const recentPopupRef = useRef(null);
    const popularPopupRef = useRef(null);
    const searchByKeywordRef = useRef(null);

    const searchKeywords = [
        "Bangladeshi", "Indian", "Pakistani", "Chinese", "Thai",
        "Pizza", "Burger", "Pasta", "Sandwich", "Sushi"
        // ... add all keywords here
    ];

    const popularSearches = [
        "Pizza", "Burger", "Biryani", "Fried Chicken", "Sushi"
    ];


    const userData = useSelector((state) => state.user.userData)

    const getRestaurants = async (searchKeyword) => {
        const userLat = userData?.address[0]?.location?.coordinates[1]
        const userLng = userData?.address[0]?.location?.coordinates[0]

        let query = new URLSearchParams({
            searchKeyword,
            lat: userLat,
            lng: userLng
        })
        try {
            const response = await axios.get(`http://localhost:5000/api/restaurant/search?${query.toString()}`)
            if (response.data.message) {
                setSearchRestaurants(response.data.data)
                setShowFilteredRestaurant(true)
                query = ''
            }
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            const inputClicked = inputRef.current && inputRef.current.contains(event.target);
            const popupClicked =
                (recentPopupRef.current && recentPopupRef.current.contains(event.target)) ||
                (popularPopupRef.current && popularPopupRef.current.contains(event.target)) ||
                (searchByKeywordRef.current && searchByKeywordRef.current.contains(event.target));

            if (!inputClicked && !popupClicked) {
                setShowOverlay(false);
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
        : searchKeywords.filter(keyword =>
            keyword.toLowerCase().startsWith(queryKeyword.toLowerCase())
        );

    const handleRecentSearchKeywordAdd = (keyword) => {
        setRecentSearchKeyword(prev => {
            const filtered = prev.filter(item => item !== keyword);
            return [keyword, ...filtered];
        });
    };

    const handleRecentSearchKeywordDel = (key) => {
        const keyword = recentSearchKeyword.filter(keyword => keyword !== key);
        setRecentSearchKeyword(keyword);
    };

    const handleRemoveInput = () => {
        setQueryKeyword('');
        setSuggestKeywordPopup(true);
    };

    const handleSearch = (searchKeyword) => {
        console.log('search for ', searchKeyword);
    };

    return (
        <div className='full relative'>

            <div className='w-full flex items-center gap-4 mt-6'>
                    <input
                        ref={inputRef}
                        type="search"
                        placeholder='Search for restaurant, cuisines and dishes'
                        className='w-full text-sm lg:text-[18px] h-16 px-4 rounded-3xl focus:outline-3 outline-gray-200 focus:border-2 border-blue-400 bg-gray-100'
                        onClick={() => {
                            setSuggestKeywordPopup(true);
                            setShowOverlay(true);
                            setRecentKeywordPopup(true);
                        }}
                        onChange={handleOnchange}
                        value={queryKeyword}
                    />
                <div onClick={() => setIsMobileFilterbarModal(true)} className='h-16 flex xl:hidden items-center gap-2 font-semibold text-gray-600 border border-gray-200 px-3 rounded-3xl cursor-pointer'>
                    <HiAdjustmentsHorizontal className='text-[20px] md:text-2xl' />
                    <span>Filter</span>
                </div>
            </div>

            {/* Recent & Popular Popups */}
            <div ref={recentPopupRef} className='absolute w-full z-10'>
                {!queryKeyword && recentKeywordPopup &&
                    <div className=' mt-2 bg-white shadow-2xl rounded-[8px] flex-wrap'>
                        {recentSearchKeyword.length > 0 && (
                            <div className='py-2.5 px-6 mb-6'>
                                <h1 className='font-bold text-[18px] pb-2 text-gray-900'>Recent search</h1>
                                {recentSearchKeyword.slice(0, 4).map((searchKeyword, index) => (
                                    <div key={index} className='flex items-center justify-between'>
                                        <button
                                            className='rounded-2xl flex items-center gap-6 py-1 mt-2 cursor-pointer'
                                            onClick={() => { getRestaurants(searchKeyword), setQueryKeyword(searchKeyword), setSuggestKeywordBySearchPopup(false), handleRecentSearchKeywordAdd(searchKeyword), handleSearch(searchKeyword) }}
                                        >
                                            <PiClockCounterClockwise className='text-[24px]' /> {searchKeyword}
                                        </button>
                                        <button className='text-[18px] cursor-pointer' onClick={() => { getRestaurants(searchKeyword), handleRecentSearchKeywordDel(searchKeyword) }}>
                                            <RxCross2 />
                                        </button>
                                    </div>
                                ))}
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
                                            getRestaurants(searchKeyword),
                                                setQueryKeyword(searchKeyword),
                                                setSuggestKeywordPopup(false),
                                                handleRecentSearchKeywordAdd(searchKeyword),
                                                setSuggestKeywordBySearchPopup(false),
                                                handleSearch(searchKeyword)
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
            <div ref={searchByKeywordRef} className='w-200 relative z-10 bg-white text-gray-600 mt-2'>
                {suggestKeywordBySearchPopup && (
                    <div className='shadow-2xl rounded-2xl'>
                        {suggestkeyworyBySearch.map((searchKeyword, index) => (
                            <button
                                key={index}
                                className='w-full h-10 flex justify-between items-center cursor-pointer mt-2 px-4 hover:bg-gray-100'
                                onClick={() => { getRestaurants(searchKeyword), setQueryKeyword(searchKeyword), setSuggestKeywordBySearchPopup(false), handleRecentSearchKeywordAdd(searchKeyword), handleSearch(searchKeyword) }}
                            >
                                <span className='flex gap-6 items-center'><GoSearch className='text-2xl' /> {searchKeyword}</span>
                                <GoArrowUpLeft className='text-2xl' />
                            </button>
                        ))}
                        {queryKeyword && <p className='px-4 py-2'>Search for "{queryKeyword}"</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
