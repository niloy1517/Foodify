import mongoose from 'mongoose'



const userSchema = new mongoose.Schema({
    profile: {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        username: { type: String },
        dateOfBirth: { type: String },
        gender: { type: String },
        image: { type: String },
        phone: { type: String },
    },
    auth: {
        passwordHash: { type: String, required: true, trim: true },
        isAccountVerified: { type: Boolean, default: false },
    },
    verification: {
        otp: { type: String },
        otpExpireAt: { type: Date, default: null },
    },
    passwordReset: {
        otp: { type: String },
        otpExpireAt: { type: Date, default: null },
    },
    changePassword: {
        otp: { type: String },
        otpExpireAt: { type: Date, default: null },
    },
    address: [{
        fullName: { type: String },
        phone: { type: String },
        label: { type: String },
        house: { type: String },
        road: { type: String },
        block: { type: String },
        street: { type: String },
        area: { type: String },
        city: { type: String },
        district: { type: String },
        postalCode: { type: String },
        country: { type: String },
        subLocation: {type: String},
        apartment:{type: String},
        riderNote: { type: String },
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
        isDefault: { type: Boolean, default: false }
    }],
    role: {type: String, default: 'user'},
    orders: [{
        order: {type: mongoose.Schema.Types.ObjectId, ref: 'UserOrder'}
    }]
}, {timestamps: true})

userSchema.index({ 'profile.email': 0 }, { unique: true });
userSchema.index({ 'address.location': '2dsphere' })

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export { userModel }