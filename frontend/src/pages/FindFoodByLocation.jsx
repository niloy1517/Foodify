import React, { useContext, useEffect } from 'react';
import { LuLocateFixed } from 'react-icons/lu';
import { GrLocation } from 'react-icons/gr';
import { storeContext } from '../Context/Context';
import { CiSearch } from "react-icons/ci";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocationRestaurants } from '../Hooks/useLocationRestaurants';

const FindFoodByLocation = () => {
    const { setFindFoodByLocationPopup } = useContext(storeContext);
    const {
        searchKey,
        setSearchKey,
        searchAddresses,
        setSearchAddresses,
        searchLocation,
        setFullAddressData,
        saveAddressInLocalStorage,
        locateLocation,
        MapEventHandler,
        setCoordinates,
        coordinates,
    } = useLocationRestaurants();

    useEffect(() => {
        // store user location from localStorage
        const userLocation = JSON.parse(localStorage.getItem('defaultLocation'))
        if (!userLocation) return;
        setSearchKey(userLocation.display_name)
        setCoordinates({
            lat: userLocation.lat,
            lng: userLocation.lon
        })
    }, [])


    return (
        <div className='relative w-full flex items-center justify-center px-4' onClick={(e) => e.stopPropagation()}>
            <div className='w-full lg:w-[700px] flex flex-col justify-center items-center py-4 bg-white h-auto overflow-hidden px-4 z-20 rounded-2xl'>
                <div className='flex flex-col gap-3 text-gray-600'>
                    <div className='flex items-center gap-2'>
                        <GrLocation className='text-3xl' />
                        <p className='text-[22px] font-medium'>
                            What's your exact location?
                        </p>
                    </div>
                    <p>
                        Providing your location enables more accurate search and
                        delivery ETA, seamless order tracking and personalised
                        recommendation
                    </p>
                </div>

                <div className='w-full h-16 flex items-center justify-between gap-6 border border-gray-200 px-4 my-6'>
                    <input
                        type='text'
                        placeholder='Enter your location'
                        value={searchKey}
                        onChange={(e) => searchLocation(e.target.value)}
                        className='w-full outline-0'
                    />
                    <button
                        onClick={locateLocation}
                        className='w-[35%] md:w-[25%] flex justify-end items-center gap-2 hover:text-orange-600 cursor-pointer'
                    >
                        <LuLocateFixed /> Locate Me
                    </button>
                </div>

                {coordinates?.lat && coordinates?.lng && (
                    <MapContainer
                        center={[coordinates.lat, coordinates.lng]}
                        zoom={13}
                        className='w-full lg:w-160 h-96 relative z-0'
                    >
                        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                        <Marker position={[coordinates.lat, coordinates.lng]} />
                        <MapEventHandler />
                    </MapContainer>
                )}

                <button
                    onClick={() => {
                        setFindFoodByLocationPopup(false);
                        saveAddressInLocalStorage()
                    }}
                    className='w-full h-14 bg-orange-600 text-white font-bold mt-10 cursor-pointer rounded-2xl'
                >
                    Find Food
                </button>
            </div>
            <div className='min-w-[96%] absolute flex justify-center items-center mx-auto top-54 z-30 px-4'>
                {
                    searchAddresses.length > 0 &&
                    <ul className='max-h-[400px] overflow-y-auto flex flex-col gap-2 bg-white shadow-2xl'>
                        {
                            searchAddresses.map((address, index) => (
                                <li onClick={() => { setSearchKey(address.display_name); setFullAddressData(address); setSearchAddresses('') }} key={index} className='w-full flex items-center gap-8 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer px-3'>
                                    <CiSearch className='text-2xl font-bold shrink-0' />
                                    <span className='flex flex-wrap md:max-w-[550px]'>{address.display_name}</span>
                                </li>
                            ))
                        }
                    </ul>
                }
            </div>
        </div>
    );
};

export default FindFoodByLocation;
