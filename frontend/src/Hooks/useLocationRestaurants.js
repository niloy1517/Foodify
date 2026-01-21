import { useEffect, useState, useContext } from 'react';
import { storeContext } from '../Context/Context';
import { restaurantService } from '../Services/restaurant.service';
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet';


export const useLocationRestaurants = () => {

    const { setRestaurants } = useContext(storeContext)

    const [searchKey, setSearchKey] = useState('');
    const [searchAddresses, setSearchAddresses] = useState([]);
    const [fullAddressData, setFullAddressData] = useState({});



    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });


    const saveAddressInLocalStorage = () => {
        localStorage.setItem('defaultLocation', JSON.stringify(fullAddressData))
    }


    useEffect(() => {
        if (!fullAddressData.lat || !fullAddressData.lon) return;

        setCoordinates({
            lat: fullAddressData.lat,
            lng: fullAddressData.lon
        })
    }, [fullAddressData])


    useEffect(() => {
        if (!coordinates.lat || !coordinates.lng) return;

        const fetchRestaurants = async () => {
            try {
                const response = await restaurantService.getNearBy({ lat: coordinates.lat, lng: coordinates.lng });
                setRestaurants(response.data.data)
            } catch (error) {
                console.log(error);
            }
        };

        fetchRestaurants();
    }, [coordinates]);



    const searchLocation = async (key) => {
        setSearchKey(key)
        if (key.length < 3) return null;
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${key}&countrycodes=bd&limit=10`
            );
            const data = await res.json();
            setSearchAddresses(data)
        } catch (err) {
            console.error(err);
        }
    };

    const locateLocation = () => {
        if (!navigator.geolocation) {
            setError('Browser not supported!');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({ lat: latitude, lng: longitude });


                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    setFullAddressData(data)
                    setSearchKey(data.display_name);
                    // localStorage.setItem('defaultLocation', JSON.stringify(data));
                } catch (err) {
                    console.error(err);
                }
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );
    };

    const MapEventHandler = () => {
        useMapEvents({
            click: async (e) => {
                const { lat, lng } = e.latlng;
                setCoordinates({ lat, lng });

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                    );
                    const data = await res.json();


                    const address = data.address || {};
                    const shortAddress = [
                        address.suburb,
                        address.city,
                        address.town,
                        address.village,
                        address.road,
                        address.postcode,
                    ]
                        .filter(Boolean)
                        .slice(0, 4)
                        .join(', ');

                    setSearchKey(shortAddress || data.display_name);
                    setFullAddressData(data);
                } catch (err) {
                    console.error(err);
                }
            },
        });
        return null;
    };

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    return {
        searchKey,
        setSearchKey,
        searchAddresses,
        setSearchAddresses,
        searchLocation,
        fullAddressData,
        setFullAddressData,
        coordinates,
        setCoordinates,
        saveAddressInLocalStorage,
        locateLocation,
        MapEventHandler,
    };
};
