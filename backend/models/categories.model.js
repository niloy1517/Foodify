import mongoose from 'mongoose'

const categoriesSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    featured: {type: Boolean, required: true},
    priority: {type: Number, required: true},
    status: {type: String, required: true},
}, {timestamps: true})


const categoriesModel = mongoose.models.Categories || mongoose.model('Categories', categoriesSchema)

export {categoriesModel}