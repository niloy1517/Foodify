import React from 'react'
import { axiosInstance } from '../Api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { clearRestaurantCart } from '../Service/Redux/Slice/AddToCartItemSlice';

export const useOrderManager = () => {
    const userData = useSelector((state) => state.user.userData);

    const userId = userData?._id || "guest";

    const dispatch = useDispatch()

    const getOrderData = async () => {
        try {
            const response = await axiosInstance.get(
                `/user/order/list/${userData._id}`
            );

            const orders = response?.data?.data || [];
           
        } catch (error) {
            console.log(error);
        }
    };


    return { getOrderData }
}

export default useOrderManager