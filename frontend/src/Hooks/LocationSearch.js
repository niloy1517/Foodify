import React, { useState } from 'react'

export function LocationSearch() {

    const [searchKey, setSearchKey] = useState('')
    const [results, setResults] = useState([])

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const [coordinates, setCoordinates] = useState({ lat: 23.8103, lng: 90.4125 })

    

    const search = async (text) => {
        setSearchKey(text)
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${text}&countrycodes=bd&limit=10`)
            const data = await response.json()
            setResults(data)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const locateLocation = async () => {
        if (!navigator.geolocation) {
            setError('Browser not supported!')
            return
        }
        setError(null)
        setLoading(true)

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            console.log(latitude, longitude)
            setCoordinates({ lat: latitude, lng: longitude })
            setLoading(false)
        }, (error) => {
            setError(error.message)
            setLoading(false)
        })
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates?.lat}&lon=${coordinates.lng}`)
            const data = await response.json()
            setSearchKey(data.display_name)
            console.log(data)
        } catch (error) {
            console.log(error)
        }

    }

    return { search, searchKey, setSearchKey, results, setResults, locateLocation }
}

