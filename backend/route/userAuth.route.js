import express from 'express'
import { changePassword, changePasswordOtpVerify, getUserProfileData, login, logout, register, resetPassword, sendChangePasswordOtp, sendResetOpt} from '../controller/userAuth.controller.js';
import { userAuth } from '../middleware/userAuth.middleware.js';
// import upload from '../middleware/upload.js'

const userAuthRoute = express.Router();

userAuthRoute.post('/registration', register)
userAuthRoute.post('/login', login)
userAuthRoute.post('/logout', logout)
userAuthRoute.post('/reset/password/otp', sendResetOpt)
userAuthRoute.post('/reset/password', resetPassword)
userAuthRoute.post('/change/password/otp', sendChangePasswordOtp)
userAuthRoute.post('/change/password/otp/verify', userAuth, changePasswordOtpVerify)
userAuthRoute.post('/change/password', userAuth, changePassword)
userAuthRoute.get('/profile/data/:id', getUserProfileData)


export {userAuthRoute}