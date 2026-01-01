import mongoose from 'mongoose'

const districtSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, required: true},
    isEnable: {type: String, required: true, default: 'active'}
}, {timestamps: true})


const districtModel = mongoose.models.District || mongoose.model('District', districtSchema)

export { districtModel }