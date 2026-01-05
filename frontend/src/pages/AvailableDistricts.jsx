import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setDistrictId } from '../Service/Redux/Slice/DistrictSlice'


const AvailableDistricts = () => {
    const [districts, setDistricts] = useState([])

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getDistrictList = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/district/list`)
            setDistricts(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDistrictList()
    }, [])

    return (
        <div className='w-full px-4 md:px-10 py-10'>
            <h1 className='text-2xl md:text-4xl font-bold py-15'>We are available in this district!</h1>

            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                {
                    districts.map((district, index) => (
                        <div key={index} className=''>
                            {district.isEnable === 'active' &&
                                <div key={index}>
                                    <img className='w-full h-[280px] rounded-2xl' src={`http://localhost:5000/images/${district.image}`} alt="" />
                                    <button onClick={() => { dispatch(setDistrictId(district._id)), navigate('/restaurants/district') }} className='bg-white text-black w-34 h-9 rounded-[10px] font-bold absolute mt-[-50px] ml-10 cursor-pointer hover:bg-orange-100'>{district.name}</button>
                                </div>
                            }
                        </div>
                    ))
                }
            </div>


        </div>
    )
}

export default AvailableDistricts