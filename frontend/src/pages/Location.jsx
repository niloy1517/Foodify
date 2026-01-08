import React, { useContext, useState } from 'react'
import { LuLocateFixed } from "react-icons/lu";
import { storeContext } from '../Context/Context';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { GrLocation } from "react-icons/gr";
import { setNewDeliveryAddress } from '../Service/Redux/Slice/UserDataSlice';

const Location = ({setOpenMap}) => {
    axios.defaults.withCredentials = true;
    const { locateLocation, coordinates, setCoordinates, address, setAddress } = useContext(storeContext)

    const { addressPart, short } = address;
    const { lat, lng } = coordinates;

    const [addNewAddress, setAddNewAddress] = useState({})
    const [errorMessage, setErrorMessage] = useState(false)
    console.log(coordinates)   
    const dispatch = useDispatch()
    


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


    const MapEventHandeler = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setCoordinates({ lat, lng })
                setAddNewAddress(prev => ({
                    ...prev,
                    location: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    }
                }))
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                    const data = await response.json()

                    if (data) {
                        setAddNewAddress(prev => ({
                            ...prev,
                            area: data.address.neighbourhood || data.address.suburb || data.address.subLocality || '',
                            street: data.address.road || data.address.street || '',
                            city: data.address.city || data.address.town || data.address.village || '',
                            district: data.address.state_district || '',
                            postalCode: data.address.postcode || '',
                            country: data.address.country || "",

                        }))
                        const addressPart = data.address
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
                            setAddNewAddress(prev => ({
                                ...prev,
                                subLocation: short
                            }))
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }
    return (
        <div className='px-4' onClick={(e) => e.stopPropagation(e)}>
            <div className='w-full lg:w-[700px] flex flex-col py-4 bg-white h-150 md:h-180 overflow-hidden px-4 z-20 rounded-2xl'>
                <div className='flex flex-col gap-3 text-gray-600'>
                    <div className='flex items-center gap-2'>
                        <GrLocation className='text-3xl' />
                        <p className='text-[22px] font-medium'>What's your exact location?</p>
                    </div>
                    <p>Providing your location enables more accurate search and delivery ETA, seamless order tracking and personalised recommendation</p>
                </div>
                <div className='w-full h-16 flex items-center justify-between gap-6 border border-gray-200 px-4 my-6'>
                    <input
                        type="text"
                        placeholder='Enter your loaction'
                        value={addNewAddress.subLocation}
                        onChange={(e) => { setAddress(e.target.value) }}
                        className='w-full outline-0' />
                    <button onClick={() => {
                        locateLocation(),
                            setAddNewAddress({
                                street: addressPart?.street || addressPart?.road || '',
                                area: addressPart.neighbourhood || addressPart.suburb || addressPart.subLocality || "",
                                city: addressPart.city || addressPart.town || addressPart.village || '',
                                district: addressPart.state_district || '',
                                postalCode: addressPart.postcode || '',
                                country: addressPart.country || '',
                                subLocation: short,
                                location: {
                                    type: "Point",
                                    coordinates: [0, 1]
                                }
                            })
                            
                    }} className='w-[35%] flex items-center gap-2 hover:text-orange-600 cursor-pointer'><LuLocateFixed /> Locate Me</button>
                </div>

                <div>
                    { errorMessage &&
                        !addNewAddress.subLocation && 
                        <p>sdflfjd dfljdslfj</p> 
                    }
                </div>

                <MapContainer center={[lat, lng]} zoom={13} className="w-full lg:w-160 h-96 relative z-0">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[lat, lng]} />
                    <MapEventHandeler />
                </MapContainer>



                <button onClick={() => {addNewAddress.subLocation && setOpenMap(false), setErrorMessage(true), dispatch(setNewDeliveryAddress(addNewAddress))} } className='w-full h-14 bg-orange-600 text-white font-bold mt-10 cursor-pointer rounded-2xl'>Add Location</button>
            </div>
        </div>
    )
}

export default Location