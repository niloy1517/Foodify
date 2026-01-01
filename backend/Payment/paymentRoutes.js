import express from 'express'
import { payment } from './paymentController.js'
import { getOrderDetailsByTranId, verifyPayment } from './verifyPayment.js'



const paymentRoute = express.Router()

paymentRoute.post('/init', payment)
paymentRoute.post('/success/:tranId', verifyPayment)
paymentRoute.post('/failed/:tranId', verifyPayment)
paymentRoute.get('/order/details/:tranId', getOrderDetailsByTranId)

export default paymentRoute