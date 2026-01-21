import { restaurantModel } from "../models/restaurant.model.js";

import fs from 'fs'
import { type } from "os";
import path from 'path'
import { getRestaurantFoodList } from "./food.controller.js";

import { categoriesModel } from "../models/categories.model.js"
import mongoose from "mongoose";
import { pipeline } from "stream";

const addRestaurant = async (req, res) => {
    const restaurantData = JSON.parse(req.body.restaurantData)
    const { restaurantName, ownerName, email, phone, description, address, city, zipcode, deliveryRadius, longitude, latitude, cuisines, status, deliveryTime, deliveryFee, openingTime, closingTime, district } = restaurantData;
    const cuisinesArray = JSON.parse(cuisines)

    const image = req.file?.filename;

    if (!restaurantName || !ownerName || !email || !phone || !description || !image || !address || !city || !zipcode || !deliveryRadius || !longitude || !latitude || !cuisinesArray || !status || !deliveryTime || !deliveryFee || !openingTime || !closingTime || !district) {

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
            restaurantName, ownerName, email, phone, description, image, address, city, zipcode,
            deliveryRadius: Number(deliveryRadius),
            cuisines: cuisinesArray,
            status, deliveryTime, deliveryFee, openingTime, closingTime, longitude, latitude, district,
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

const getNearbyRestaurants = async (req, res) => {
    const { lat, lng } = req.query;
    console.log(lng, lat, 'asfjalsjfladsf')
    try {
        const pipeline = [];

        pipeline.push({
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [Number(lng), Number(lat)]
                },
                distanceField: 'distance',
                maxDistance: 20000,
                spherical: true

            }
        })

        pipeline.push({
            $addFields: {
                canDeliver: {
                    $lte: ['$distance', { $multiply: ['$deliveryRadius', 1000] }]
                }
            }
        })

        
        const restaurants = await restaurantModel.aggregate(pipeline)

        res.status(200).json({ success: true, message: 'Restaurants found successfuly', data: restaurants })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Restaurants found failed' })
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

const getRestaurantsName = async (req, res) => {
    try {
        const restaurantList = await restaurantModel.find(
            {},
            { restaurantName: 1, cuisines: 1, _id: 0 }
        )

        res.json({ success: true, message: 'Data found', data: restaurantList })
    } catch (error) {
        res.json({ success: false, message: 'Data not found' })
    }
}

const filterRestaurantsByDistance = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        if (isNaN(latNum) || isNaN(lngNum)) {
            return res.status(400).json({ success: false, message: 'Invalid coordinates' });
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
            { $match: { $expr: { $lte: ["$distanceMeters", { $multiply: ["$deliveryRadius", 1000] }] } } },
            { $sort: { distanceMeters: 1 } }
        ]);

        // remove duplicates
        const uniqueRestaurants = []
        const seenIds = new Set()

        for (let r of results) {
            if (!seenIds.has(r._id.toString())) {
                seenIds.add(r._id.toString())
                uniqueRestaurants.push(r)
            }
        }


        res.json({
            success: true,
            message: 'Restaurants filtered successfully',
            data: uniqueRestaurants
        });
        console.log(uniqueRestaurants.length)
    } catch (error) {
        res.json({ success: false, message: 'Something went wrong', error: error.message });
    }
};



const getFilteredRestaurants = async (req, res) => {
    const {
        category, searchKeyword, sortBy, cuisine,
        rating, priceOrder, distance, lat, lng
    } = req.query;
console.log(req.query)
    try {
        const matchQuery = {}

        if (rating) {
            matchQuery.rating = { $gte: Number(rating) }
        }

        if (cuisine) {
            matchQuery.cuisines = { $regex: cuisine, $options: "i" }
        }


        const pipeline = [];

        if (category || searchKeyword || priceOrder) {
            pipeline.push({
                $lookup: {
                    from: 'foods',
                    localField: '_id',
                    foreignField: 'restaurant',
                    as: 'foods'
                }
            })
        }



        if (category) {
            pipeline.push({
                $match: {
                    foods: {
                        $elemMatch: {
                            category: new mongoose.Types.ObjectId(category)
                        }
                    }
                }
            })

        }


        if (searchKeyword) {
            pipeline.push({
                $addFields: {
                    foods: {
                        $map: {
                            input: '$foods',
                            as: 'food',
                            in: '$$food.foodName'
                        }
                    }
                }
            });


            pipeline.push({
                $match: {
                    $or: [
                        { restaurantName: searchKeyword },
                        { cuisines: { $regex: searchKeyword, $options: 'i' } },
                        { foods: { $regex: searchKeyword, $options: 'i' } }
                    ]
                }
            })
        }

        if (sortBy === 'topRated') {
            pipeline.push({ $sort: { rating: -1 } })
        }

        if (sortBy === 'distance') {
            pipeline.push({
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [Number(lng), Number(lat)]
                    },
                    distanceField: 'distance',
                    maxDistance: distance ? Number(distance) * 1000 : 5000,
                    spherical: true,
                    query: matchQuery
                }
            })
        } else {
            pipeline.push({ $match: matchQuery })
        }

        if (sortBy === 'delivery') {
            pipeline.push({ $sort: { deliveryTime: 1 } })
        }

        if (priceOrder) {
            pipeline.push({
                $addFields: {
                    avgPrice: { $avg: '$foods.price' }
                }
            });

            pipeline.push({
                $sort: {
                    avgPrice: priceOrder === 'highToLow' ? -1 : 1
                }
            })
        }



        // pipeline.push({
        //     $geoNear: {
        //         near: {
        //             type: 'Point',
        //             coordinates: [Number(lng), Number(lat)]
        //         },
        //         distanceField: 'distance',
        //         maxDistance: distance ? Number(distance) * 1000 : 5000,
        //         spherical: true,
        //         query: matchQuery
        //     }
        // })


        const restaurants = await restaurantModel.aggregate(pipeline);

        res.status(200).json({
            success: true,
            message: "Restaurants filtered successfully",
            data: restaurants
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch restaurants"
        });
    }
};




export { addRestaurant, deleteRestaurant, updateRestaurant, getRestaurants, getRestaurant, districtWiseRestaurant, filterRestaurantsByDistance, getRestaurantsName, getFilteredRestaurants, getNearbyRestaurants }