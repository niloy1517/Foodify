import { userOrderModel } from "../models/userOrder.model.js";

const addUserOrder = async (req, res) => {
    const orderData = JSON.parse(req.body.orderData)

    const { customerId, subtotal, deliveryFee, total, customerInfo, deliveryAddress } = orderData;



    const { _id, restaurantName } = orderData.restaurantData;


    const items = orderData.carts[_id].items;

    const orderId = String('#FD-' + Math.floor(100000 + Math.random() * 900000))


    // try {
    //     const userOrder = new userOrderModel({
    //         orderId: orderId,
    //         user: customerId,
    //         customerName: customerInfo.name,
    //         customerPhone: customerInfo.phone,
    //         customerEmail: customerInfo.email,
    //         sublocation: deliveryAddress.sublocation,
    //         address: deliveryAddress,
    //         restaurant: _id,
    //         restaurantName,
    //         items: items.map(item => ({ foodId: item._id, name: item.foodName, image: item.image, price: item.price, quantity: item.quantity })),
    //         subtotal,
    //         deliveryFee,
    //         total,
    //         orderTime: Date.now()
    //     })
    //     await userOrder.save()

    //     res.status(200).json({ success: true, message: 'Order place successful!' })
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).json({ success: false, message: 'Something is wrong try again' })

    // }
}



const controlOrderStatus = async (req, res) => {
    const { orderId, orderStatus, updateOrderData, delivery } = req.body;
    console.log('updateOrderData', orderId, delivery)
    console.log('ji')
    try {
        const order = await userOrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }



        await userOrderModel.findByIdAndUpdate(orderId,
            { orderStatus: orderStatus || updateOrderData?.orderStatus, estimatedDeliveryTime: updateOrderData.estimatedDeliveryTime, delivery },
            { new: true }
        )

        res.status(200).json({ success: true, message: 'Order status successfuly updated', data: order })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}


const getUserOrderList = async (req, res) => {
    const userId = req.params.id;
    try {
        const userOrder = await userOrderModel.find({ user: userId }).populate('restaurant')
        if (!userOrder) {
            return res.status(404).json({ success: false, message: 'User order not found!' })
        }

        res.status(200).json({ success: true, message: 'User order details found!', data: userOrder })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong' })

    }
}

const getOrderList = async (req, res) => {
    try {
        const order = await userOrderModel.find()

        if (!order) {
            return res.status(404).json({ success: false, message: 'No order found' })
        }

        res.status(200).json({ success: true, message: 'Order found!', data: order })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}


const getSingleOrderDetails = async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await userOrderModel.findById(orderId).populate('restaurant')

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        res.status(200).json({ success: true, message: 'Order found!', data: order })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export { getUserOrderList, getOrderList, getSingleOrderDetails, controlOrderStatus }












