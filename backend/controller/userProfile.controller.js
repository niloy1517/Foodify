import { userModel } from "../models/userAuth.model.js";

const updateProfileData = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email, username, phone, gender, dateOfBirth } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required!'
            })
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required!'
            })
        }

        const payload = {
            name, email, username, phone, gender, dateOfBirth
        }

        await userModel.findByIdAndUpdate(
            userId,
            { profile: payload },
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: 'Profile update successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


const userAddressAdd = async (req, res) => {
    try {
        const { userId, label, house, road, block, city, district, postalCode, country, subLocation, location } = req.body;

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        user.address = { label, house, road, block, city, district, postalCode, country, subLocation, location }

        user.save()

        res.status(200).json({
            success: true,
            message: 'Profile update successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


const updateDefaultDeliveryAddress = async (req, res) => {
    try {
        const { userId, road, city, district, postalCode, country, subLocation, street, apartment, riderNote, label, location } = req.body;

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Delivery address is required'
            })
        }


        user.address[0] = {
            road, city, district, postalCode, country, subLocation, street, apartment, riderNote, label, location
        }

        user.save()

        res.status(200).json({
            success: true,
            message: 'Delivery address successfully updated'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const addNewDeliveryAddress = async (req, res) => {
    try {
        const { userId, road, city, district, postalCode, country, subLocation, streetOrHouse, apartment, riderNote, label, location } = req.body;

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Delivery address is required'
            })
        }

        const newDeliveryAddress = {
            road, city, district, postalCode, country, subLocation, streetOrHouse, apartment, riderNote, label, location
        }

        user.address.push(newDeliveryAddress)

        await user.save()

        res.status(200).json({
            success: true,
            message: 'Delivery address successfully added'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
        console.log(error)
    }
}


const deleteDeliveryAddress = async (req, res) => {
    try {
        const { userId } = req.body;
        const addressId = req.params.id;

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        user.address.pull({ _id: addressId })

        user.save()

        res.status(200).json({
            success: true,
            message: 'Delivery address successfully deleted'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

// const upadateAddressData = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const { label, house, road, block, city, district, postalCode, country } = req.body;


//         const payload = {
//             label, house, road, block, city, district, postalCode, country
//         }

//         await userModel.findByIdAndUpdate(
//             userId,
//             { address: address.push(payload) },
//             { new: true }
//         )

//         res.status(200).json({
//             success: true,
//             message: 'Address update successfully'
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Something went wrong'
//         })
//     }
// }


// const updateLocation = async (req, res) => {
//     const userId = req.userId;
//     const { coordinates } = req.body;
//     console.log(coordinates)


//     try {
//         const user = await userModel.findById(userId)

//         user.location.coordinates[0] = coordinates.lng;
//         user.location.coordinates[1] = coordinates.lat;

//         await user.save()
//         res.status(200).json({ success: true, message: 'Location update successful!' })
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Location update failed!' })
//     }
// }

export { updateProfileData, userAddressAdd, addNewDeliveryAddress, deleteDeliveryAddress, updateDefaultDeliveryAddress }