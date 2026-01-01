import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { FaRegImages } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const DistrictUpdate = () => {
  
    axios.defaults.withCredentials = true;

    const imageRef = useRef()

    const districtId = useSelector((state) => state.district.districtId)
  

    const [districtData, setDistrictData] = useState({
        name: '',
        image: '',
        imagePath: '',
        isEnable: ''
    })

    console.log(districtData)

    const handleOnchange = (e) => {
        setDistrictData({ ...districtData, [e.target.name]: e.target.value })
    }

    const imageOnchange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setDistrictData({
                ...districtData,
                image: URL.createObjectURL(file),
                imagePath: file
            })
        }
    }

    const uploadImage = () => {
        imageRef.current.click()
    }


    const getDistrictData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/district/data/${districtId}`)
        setDistrictData(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }


    const updateDistrict = async () => {
        const payload = {
            ...districtData,
            districtId,
        }
        const formData = new FormData();

        formData.append('district', JSON.stringify(payload))

        if (districtData.imagePath) {
            formData.append('image', districtData.imagePath)
        }
        try {
            const response = await axios.put(`http://localhost:5000/api/district/update`, formData, { withCredentials: true })
            console.log(response)
            if (response.data.success) {
                toast.success(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
            console.log(error)
        }
    }

    useEffect(() => {
      getDistrictData()
    }, [])
  return (
        <div>
            <div>
                <p>Update District</p>
            </div>
            <div className='w-[400px] flex flex-col gap-4'>
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="name">District Name</label>
                    <input type="text" name="name" id="name" value={districtData.name} placeholder='Enter district name' onChange={handleOnchange} className='border border-gray-300 py-2 px-3 h-14' />
                </div>
                <div onClick={uploadImage} className='w-[350px] h-[180px] border border-dashed border-gray-300 '>
                    <div className='w-full h-full flex justify-center items-center cursor-pointer'>
                        <input ref={imageRef} type="file" name="image" id="" className='hidden' onChange={imageOnchange} />

                        {
                            districtData.image ?
                                <img src={districtData.imagePath ? districtData.image : `http://localhost:5000/images/${districtData.image}`} alt={districtData.name} className='w-full h-full' /> :
                                <div className='flex flex-col gap-2 items-center justify-center'>
                                    <FaRegImages className='text-5xl' />
                                    <p>Upload Image</p>
                                </div>
                        }
                    </div>
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="isEnable">Enable</label>
                    <select name="isEnable" id="isEnable" value={districtData.isEnable} onChange={handleOnchange} className='border border-gray-300 py-2 px-3 h-14'>
                        <option value="" className='hidden'>Select</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <button onClick={updateDistrict} className='mt-10 py-2 px-6 bg-orange-600 text-white cursor-pointer'>Update District</button>
        </div>
  )
}

export default DistrictUpdate