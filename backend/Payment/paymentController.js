import mongoose from "mongoose";
import { sslcz } from "./sslcommerz.config.js"
import { userOrderModel } from "../models/userOrder.model.js";


//sslcommerz init

const payment = async (req, res) => {
    try {
        const { user, customerName, email, phone, restaurant, restaurantName, subtotal, deliveryFee, total, items, address, riderNote } = req.body;
console.log(items)
        // CREATE PAYMENT TRX ID
        const tranId = new mongoose.Types.ObjectId().toString()

        //CREATE ORDER ID
        const orderId = String('#FD-' + Math.floor(100000 + Math.random() * 900000))

        const data = {
            total_amount: total,
            currency: 'BDT',
            tran_id: tranId,
            success_url: `http://localhost:5000/api/payment/success/${tranId}`,
            fail_url: `http://localhost:5000/api/payment/failed/${tranId}`,
            cancel_url: 'http://localhost:5000/cancel',
            ipn_url: 'http://localhost:5000/ipn',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: customerName,
            cus_email: email,
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: phone,
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        }

        const order = await userOrderModel.findOneAndUpdate(
            { user, paymentStatus: 'Pending' },
            {
                $setOnInsert: {
                    orderId,
                    user,
                    customerName,
                    email,
                    phone,
                    restaurant,
                    restaurantName,
                    subtotal,
                    deliveryFee,
                    total,
                    items,
                    address,
                    riderNote,
                    orderTime: new Date(),
                    transactionId: tranId,
                    paymentStatus: 'Pending'
                }
            },
            { upsert: true, new: true }
        )

        const response = await sslcz.init(data);
        return res.send({ paymentUrl: response.GatewayPageURL });
    } catch (error) {
        console.log(error)
    }
}



export { payment }