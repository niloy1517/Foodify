import mongoose from "mongoose";


const userOrderSchema = new mongoose.Schema({
    orderId: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    customerName: { type: String },
    phone: { type: String },
    email: { type: String },

    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    restaurantName: { type: String },

    items: [{
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        foodName: { type: String },
        image: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 0 },
    }],

    address: {
        label: { type: String },
        city: { type: String },
        district: { type: String },
        postalCode: { type: String },
        country: { type: String },
        subLocation: { type: String },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },

            coordinates: {
                type: [Number],
                default: [0, 0]
            }
        },
        riderNote: { type: String }
    },

    delivery: {
        isSelfDeliveryBoy: { type: Boolean, default: true },
        riderName: { type: String },
        riderPhone: { type: String },
        deliveryStartAt: { type: String },
        deliveryEndAt: { type: String },
    },

    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    orderTime: { type: Date },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Preparing', 'On the way', 'Delivered', 'Failed', 'Cancelled']
    },
    orderCancelReason: { type: String },

    transactionId: { type: String, default: null },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Bkash', 'Roket', 'Nagad', 'Upay', 'Card']
    },
    paymentDate: { type: Date },
    currency: { type: String },
    gatewayResponse: { type: Object },

    estimatedDeliveryTime: {type: String}

}, { timestamps: true })


const userOrderModel = mongoose.models.UserOrder || mongoose.model('UserOrder', userOrderSchema)

export { userOrderModel }