import express from 'express'
import { getOrderList, getUserOrderList, getSingleOrderDetails, controlOrderStatus } from '../controller/userOrder.controller.js'

const userOrderRoute = express.Router()

userOrderRoute.get('/list', getOrderList)
userOrderRoute.get('/list/:id', getUserOrderList)
userOrderRoute.get('/details/:id', getSingleOrderDetails)
userOrderRoute.post('/status', controlOrderStatus)
export { userOrderRoute }