import express from 'express'
import { addNewDeliveryAddress, deleteDeliveryAddress, updateProfileData, userAddressAdd, updateDefaultDeliveryAddress } from '../controller/userProfile.controller.js'
import { userAuth } from '../middleware/userAuth.middleware.js'

const userProfileRoute = express.Router()

userProfileRoute.put('/profile/update', userAuth, updateProfileData)
userProfileRoute.post('/address/add', userAddressAdd)
userProfileRoute.post('/delivery/address/add', addNewDeliveryAddress)
userProfileRoute.put('/update/delivery/address', updateDefaultDeliveryAddress)
userProfileRoute.delete('/delivery/address/delete/:id', deleteDeliveryAddress)


export {userProfileRoute}