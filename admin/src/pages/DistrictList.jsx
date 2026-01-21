import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegEdit } from 'react-icons/fa'
import { MdOutlineDelete } from 'react-icons/md'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useEffect } from 'react'
import { setDistrictId } from '../Services/Redux/Slices/districtSlice'
import { axiosInstance } from '../Api/axiosInstance'



const DistrictList = () => {

  const tableHeader = ['Image', 'Name', 'Isenable', 'Action']

  const [districts, setDistricts] = useState([])

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getDistrictList = async () => {
    try {
      const response = await axiosInstance.get(`/district/list`)
      setDistricts(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteDistrict = async (districtId) => {
    try {
      const response = await axiosInstance.delete(`/district/delete/${districtId}`)
      if (response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }


  useEffect(() => {
    getDistrictList()
  }, [districts])
  return (
    <div className="w-full overflow-x-auto p-4">
      <table className="w-full table-fixed border-collapse text-left">
        <thead className="bg-gray-100 uppercase">
          <tr>
            {tableHeader.map((item, index) => (
              <th key={index} className="px-4 py-2 border-b border-gray-300">{item}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {districts.length > 0 ? (
            districts.map((district) => (
              <tr key={district._id} className="border-b border-gray-200 text-[16px] font-medium text-gray-700">
                <td className="px-4 py-2">
                  <img
                    className="w-24 h-16 object-cover rounded"
                    src={`${import.meta.env.VITE_IMAGE_BASE_URL}/images/${district.image}`}
                    alt={district.name}
                  />
                </td>
                <td className="px-4 py-2">
                  {district.name}
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2.5 py-1 rounded ${district.isEnable === 'active' ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'}`}>
                    {district.isEnable === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-3 mt-4.5">
                  <button
                    className="px-1 py-1 flex justify-center items-center rounded bg-blue-600 text-white text-[24px] cursor-pointer"
                    onClick={() => {
                      dispatch(setDistrictId(district._id))
                      navigate('/district/update')
                    }}
                  >
                    <FaRegEdit className="inline" />
                  </button>
                  <button
                    className="px-1 py-1 flex justify-center items-center rounded bg-red-600 text-white text-[24px] cursor-pointer"
                    onClick={() => deleteDistrict(district._id)}
                  >
                    <MdOutlineDelete className="inline" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-15 text-2xl text-gray-700 font-medium">
                No Restaurants Found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DistrictList