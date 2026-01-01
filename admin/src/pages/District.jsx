import React from 'react'
import { useNavigate } from 'react-router-dom'
import DistrictList from './DistrictList'

const District = () => {

    const navigate = useNavigate()
  return (
    <div className='w-full'>
        <div className='flex justify-between px-6 border-b border-gray-200 pb-2 pt-6'>
            <p>District</p>
            <button onClick={() => { navigate('/district/add')}} className='bg-orange-600 text-white px-6 py-2 cursor-pointer rounded'>Add District</button>
        </div>
        <DistrictList />
    </div>
  )
}

export default District