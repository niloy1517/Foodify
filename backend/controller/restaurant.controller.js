import { restaurantModel } from "../models/restaurant.model.js";
import fs from 'fs'
import path from 'path'
import { userModel } from "../models/userAuth.model.js";


const addRestaurant = async (req, res) => {
    const restaurantData = JSON.parse(req.body.restaurantData)
    const { restaurantName, ownerName, email, phone, description, address, city, zipcode, deliveryRadius, longitude, latitude, cuisines, status, deliveryTime, deliveryFee, openingTime, closingTime, district } = restaurantData;

    const image = req.file?.filename;

    if (!restaurantName || !ownerName || !email || !phone || !description || !image || !address || !city || !zipcode || !deliveryRadius || !longitude || !latitude || !cuisines || !status || !deliveryTime || !deliveryFee || !openingTime || !closingTime || !district) {

        if (image) {
            const imagePath = path.join('uploads', req.file.filename)
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.log('Image deleting failed')
                } else {
                    console.log('Image deleting successful')
                }
            })
        }

        return res.json({ success: false, message: 'All field are required!' })
    }

    try {
        const restaurant = new restaurantModel({
            restaurantName, ownerName, email, phone, description, image, address, city, zipcode, deliveryRadius, cuisines, status, deliveryTime, deliveryFee, openingTime, closingTime, longitude, latitude, district,
            location: {
                type: 'Point',
                coordinates: [Number(longitude), Number(latitude)]
            }
        })
        await restaurant.save()

        res.json({ success: true, message: 'Restaurant add successful!' })
    } catch (error) {
        console.log(error)
        if (image) {
            const imagePath = path.join('uploads', image)
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.log('Image deleting failed')
                } else {
                    console.log('Image deleting successful')
                }
            })
        }

        res.json({ success: false, message: 'Restaurant add failed!' })
    }
}



const deleteRestaurant = async (req, res) => {
    const restaurantId = req.params.id;

    try {
        const restaurant = await restaurantModel.findById(restaurantId);

        if (!restaurant) {
            return res.json({ success: false, message: 'Restaurant not found!' })
        }

        const image = restaurant.image

        await restaurantModel.findByIdAndDelete(restaurantId)
        const imagePath = path.join('uploads', image)
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log('Image deleting failed')
            } else {
                console.log('Image deleting successful')
            }
        })
        res.json({ success: true, message: 'Restaurant delete successful!' })
    } catch (error) {
        res.json({ success: false, message: 'Restaurant delete failed!' })
    }
}



const updateRestaurant = async (req, res) => {
    const { restaurantId } = req.body;
    const restaurantData = JSON.parse(req.body.restaurantData)
    const { restaurantName, ownerName, email, phone, description, address, city, zipcode, deliveryRadius, longitude, latitude, cuisines, status, deliveryTime, deliveryFee, openingTime, closingTime } = restaurantData;
    const image = req.file ? req.file.filename : restaurantData.image;


    if (!restaurantName || !ownerName || !email || !phone || !description || !image || !address || !city || !zipcode || !deliveryRadius || !longitude || !latitude || !cuisines || !status || !deliveryTime || !deliveryFee || !openingTime || !closingTime) {
        return res.status(404).json({ success: false, message: 'All filed are required!' })
    }

    try {
        const restaurant = await restaurantModel.findById(restaurantId)

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found!' })
        }

        const imagePath = path.join('uploads', restaurant.image);

        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log('Image delete failed!')
            } else {
                console.log('Image delete successfully')
            }
        })

        await restaurantModel.findByIdAndUpdate(restaurantId, {
            restaurantName, ownerName, email, phone, description, image, address, city, zipcode, deliveryRadius, cuisines, status, deliveryTime, deliveryFee, openingTime, closingTime, longitude, latitude,
            location: {
                type: 'Point',
                coordinates: [Number(longitude), Number(latitude)]
            }
        })

        res.status(200).json({ success: true, message: 'Restaurant update successful!' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Restaurant update failed!' })
    }
}


const getRestaurants = async (req, res) => {
    try {
        const RestaurantList = await restaurantModel.find()

        res.json({ success: true, message: 'Data found', data: RestaurantList })
    } catch (error) {
        res.json({ success: false, message: 'Data not found' })
    }
}


const getRestaurant = async (req, res) => {
    const restaurantId = req.params.id;
    try {
        const restaurant = await restaurantModel.findById(restaurantId)

        res.status(200).json({ success: true, message: 'Restaurant found!', data: restaurant })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Restaurant not found!' })
    }
}


const districtWiseRestaurant = async (req, res) => {
    const districtId = req.params.id;

    try {
        const restaurant = await restaurantModel.find({ district: districtId })

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurants not found!' })
        }

        res.status(200).json({ success: true, message: 'Restaurants found!', data: restaurant })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something is wrong try again!' })
    }
}



const filterRestaurantsByDistance = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return res.status(400).json({success: false, message: 'Invalid coordinates'});
    }

    let results = await restaurantModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lngNum, latNum] },
          distanceField: "distanceMeters",
          spherical: true,
        }
      },
      { $addFields: { distanceKm: { $divide: ["$distanceMeters", 1000] } } },
      { $match: { $expr: { $lte: ["$distanceMeters", "$deliveryRadius"] } } },
      { $sort: { distanceMeters: 1 } }
    ]);

    // remove duplicates
    const uniqueRestaurants = []
    const seenIds = new Set()

    results.filter(res => {
        if(!seenIds.has(res)) {
            seenIds.add(res);
            uniqueRestaurants.push(res)
        }
    })
   

    res.status(200).json({
      success: true,
      message: 'Restaurants filtered successfully',
      data: uniqueRestaurants
    });

  } catch (error) {
    res.status(500).json({success: false, message: 'Something went wrong', error: error.message});
  }
};



export { addRestaurant, deleteRestaurant, updateRestaurant, getRestaurants, getRestaurant, districtWiseRestaurant, filterRestaurantsByDistance }