import mongoose from 'mongoose'


const foodSchema = new mongoose.Schema({
    foodName: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Categories", required: true},
    restaurant: {type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true},
    rating: {type: Number, default: 0, min: 0, max: 5},
    cuisines: {
        type: [String], 
        required: true
    },
    featured: {type: Boolean, default: false},
    price: {type: Number, required: true},
    discount: {type: Number, default: 0},
    availability: {type: Boolean, default: true, required: true},
}, {timestamps: true})


const foodModel = mongoose.models.Food || mongoose.model('Food', foodSchema)

export {foodModel}