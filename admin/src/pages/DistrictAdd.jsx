import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { FaRegImages } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { axiosInstance } from '../Api/axiosInstance';

const DistrictAdd = () => {

    const imageRef = useRef()

    const [districtData, setDistrictData] = useState({
        name: '',
        image: '',
        imagePath: '',
        isEnable: ''
    })


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


    const addDistrict = async () => {
        const payload = {
            ...districtData,
        }
        const formData = new FormData();

        formData.append('district', JSON.stringify(payload))

        if (districtData.imagePath) {
            formData.append('image', districtData.imagePath)
        }
        try {
            const response = await axiosInstance.post(`/district/add`, formData)
            if (response.data.success) {
                toast.success(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
            console.log(error)
        }
    }

    return (
        <div>
            <div>
                <p>Add New District</p>
            </div>
            <div className='w-[400px] flex flex-col gap-4'>
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="name">District Name</label>
                    <input type="text" name="name" id="name" placeholder='Enter district name' onChange={handleOnchange} className='border border-gray-300 py-2 px-3 h-14' />
                </div>
                <div onClick={uploadImage} className='w-[350px] h-[180px] border border-dashed border-gray-300 '>
                    <div className='w-full h-full flex justify-center items-center cursor-pointer'>
                        <input ref={imageRef} type="file" name="image" id="" className='hidden' onChange={imageOnchange} />

                        {
                            districtData.imagePath ?
                                <img src={districtData.image} alt="" className='w-full h-full' /> :
                                <div className='flex flex-col gap-2 items-center justify-center'>
                                    <FaRegImages className='text-5xl' />
                                    <p>Upload Image</p>
                                </div>
                        }
                    </div>
                </div>
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="isEnable">Active District</label>
                    <select name="isEnable" id="isEnable" onChange={handleOnchange} className='border border-gray-300 py-2 px-3 h-14'>
                        <option value="" className='hidden'>Select</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <button onClick={addDistrict} className='mt-10 py-2 px-6 bg-orange-600 text-white cursor-pointer'>Add District</button>
        </div>
    )
}

export default DistrictAdd