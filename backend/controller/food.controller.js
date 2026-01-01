import { foodModel } from "../models/food.model.js";
import { restaurantModel } from "../models/restaurant.model.js";
import fs from 'fs';
import path from 'path';

const restaurantFoodAdd = async (req, res) => {
    const foodData = JSON.parse(req.body.foodData)
    const { restaurant, foodName, description, category, price, discount, featured, availability, cuisines } = foodData;
    const image = req.file?.filename;

    if (!restaurant || !foodName || !description || !image || !category || !price || !discount || !featured || !availability || !cuisines) {

        if (image) {
            const imagePath = path.join('uploads', image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.log('Image delete failed!')
                } else {
                    console.log('Image delete successfully')
                }
            })
        }

        return res.status(404).json({ success: false, message: 'All field are required' });
    }


    try {
        const food = await foodModel({
            restaurant, foodName, description, image, category, price, discount, featured, availability, cuisines
        })
        await food.save()
        res.status(201).json({ success: true, message: 'Food add successful!' })
    } catch (error) {

        const imagePath = path.join('uploads', image);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log('Image delete failed!')
            } else {
                console.log('Image delete successfully')
            }
        })

        res.status(500).json({ success: false, message: 'Food add failed!' })
    }
}


const restaurantFoodUpdate = async (req, res) => {
    const foodData = JSON.parse(req.body.foodData);
    const { _id, foodName, description, category, cuisines, featured, price, discount, availability } = foodData;
    const image = req.file ? req.file.filename : foodData.image;

    if (!foodName || !image || !description || !category || !cuisines || !featured || !price || !discount || !availability) {
        return res.status(404).json({ success: false, message: 'All field are required!' })
    }

    try {
        const existingFood = await foodModel.findById(_id);

        if (!existingFood) {
            return res.status(404).json({ success: false, message: 'Food not found!' })
        }

        const imagePath = path.join('uploads', existingFood.image);

        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log('Image delete failed!')
            } else {
                console.log('Image delete successfully')
            }
        })

        await foodModel.findByIdAndUpdate(
            _id,
            { foodName, image, description, category, cuisines, featured, price, discount, availability },
            { new: true }
        )

        res.status(200).json({ success: true, message: 'Food update successful!' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something is wrong try again!' })
    }
}


const restaurantFoodDelete = async (req, res) => {
    const foodId = req.params.id;
    try {
        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food not found!' })
        }

        const imagePath = path.join('uploads', food.image);

        await foodModel.findByIdAndDelete({ _id: foodId })


        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log('Image delete failed!')
            } else {
                console.log('Image delete successfully')
            }
        })
        res.status(200).json({ success: true, message: 'Food delete successful!' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something is wrong try again!' })
    }
}


const getRestaurantFoodList = async (req, res) => {
    const restaurantId = req.params.id;

    try {
        const restaurant = await restaurantModel.findById(restaurantId)

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found!' });
        }

        const foods = await foodModel.find({ restaurant: restaurantId })
            .populate('category')
            .exec();

        if (!foods) {
            return res.status(404).json({ success: false, message: 'Foods not found!' });
        }

        const categories = [...new Set(foods.map(food => food.category.name))]



        res.status(200).json({ success: true, message: 'Foods item found!', foods, categories })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something is wrong try again!' })
    }
}


const getFoodItem = async (req, res) => {
    const foodId = req.params.id;
    try {
        const foodItem = await foodModel.findById(foodId);

        if (!foodItem) {
            return res.status(404).json({ success: false, message: 'Food item not found!' })
        }

        res.status(200).json({ success: true, message: 'Food item found!', data: foodItem })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something is wrong try again!' })
    }
}

export { restaurantFoodAdd, restaurantFoodUpdate, restaurantFoodDelete, getRestaurantFoodList, getFoodItem }