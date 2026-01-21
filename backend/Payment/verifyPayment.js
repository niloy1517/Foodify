import axios from "axios";
import { userOrderModel } from "../models/userOrder.model.js";

export const verifyPayment = async (req, res) => {
    const tranId = req.params.tranId;
    const val_id = req.body.val_id;

    // If payment proccessing failed then store failed data in paymentFailedData 
    const paymentFailedData = req.body


    try {
        const order = await userOrderModel.findOne({ transactionId: tranId })

        if (!order) {
            return res.redirect(`http://localhost:5173/payment-failed/${tranId}`)
        }

        if (!val_id) {
            await userOrderModel.findOneAndUpdate(
                { transactionId: tranId },
                {
                    paymentStatus: 'Failed',
                    paymentDate: new Date(),
                    gatewayResponse: paymentFailedData,
                    orderStatus: 'Failed'
                }
            )
            return res.redirect(`http://localhost:5173/payment-failed/${tranId}`)
        }

        const store_id = process.env.STORE_ID;
        const store_pass = process.env.STORE_PASS;

        const verifyUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_pass}&format=json`;

        const response = await axios.get(verifyUrl);
        const data = response.data;

        if (data.status === 'VALID') {
            await userOrderModel.findOneAndUpdate(
                { transactionId: tranId },
                {
                    paymentStatus: 'Paid',
                    paymentDate: new Date(),
                    gatewayResponse: data,
                    orderStatus: 'Pending'

                }
            )
        }
        res.redirect(`http://localhost:5173/payment-success/${tranId}`)
    } catch (error) {
        await userOrderModel.findOneAndUpdate(
            { transactionId: tranId },
            {
                paymentStatus: 'Cancelled',
                paymentDate: new Date(),
                gatewayResponse: paymentFailedData,
                orderStatus: 'Cancelled'
            },

        );
        console.log(error)
        res.redirect(`http://localhost:5173/payment-failed/${tranId}`)
    }
}




export const getOrderDetailsByTranId = async (req, res) => {
    const tranId = req.params.tranId;
    try {
        const order = await userOrderModel.findOne({ transactionId: tranId })

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        res.status(200).json({ success: true, message: 'Order found', data: order })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}