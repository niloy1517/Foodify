import mongoose from 'mongoose'


const restaurantSchema = new mongoose.Schema({
    restaurantName: {type: String, required: true},
    ownerName: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    zipcode: {type: String, required: true},
    deliveryRadius: {type: Number, required: true},
    cuisines: {
        type: [String],
        required: true
    },
    status: {type: String, required: true},
    deliveryTime: {type: String, required: true},
    deliveryFee: {type: Number, required: true},
    openingTime: {type: String, required: true},
    closingTime: {type: String, required: true},
    rating: {type: Number, min: 1, max: 5, default: 1},
    isOpen: {type: Boolean, default: false},
    longitude: {type: String, required: true},
    latitude: {type: String, required: true},
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
    district: {type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true}
}, {timestamps: true})

restaurantSchema.index({location: '2dsphere'})

const restaurantModel = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema)


export {restaurantModel}