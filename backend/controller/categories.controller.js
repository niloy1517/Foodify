import { categoriesModel } from "../models/categories.model.js";

import fs from 'fs'
import path from 'path'

const categoryAdd = async (req, res) => {
    const categoriesData = JSON.parse(req.body.categoriesData)

    const {name, description, priority, status, featured} = categoriesData;

    const image = req.file?.filename;


    if(!name || !image || !description || !priority || !status || !featured) {
        if(image) {
            const imagePath = path.join('uploads', image)
            fs.unlink(imagePath, (err) => {
               if(err) {
                 console.log('image deleting failed!')
               } else {
                console.log('image deleting successful!')
               }
            })
        }
        return res.json({success: false, message: 'All details are required!'})
    }
    try {
        const category = new categoriesModel({
            name, image, description, priority, status, featured
        })

        await category.save()

        res.json({success: true, message: 'Category add successful!'})
    } catch (error) {
        if(error) {
            const imagePath = path.join('uploads', image)
            fs.unlink(imagePath, (err) => {
               if(err) {
                 console.log('image deleting failed!')
               } else {
                console.log('image deleting successful!')
               }
            }) 
        }
        res.json({success: false, message: 'Category add failed!'})
    }
}


const categoryUpdate = async (req, res) => {
    const { categoryId } = req.body;
    const categoryData = JSON.parse(req.body.category)
    const { name, description, status, priority, featured } = categoryData;

    const image = req.file ? req.file.filename : categoryData.image;

    if(!name || !image || !description || !priority || !status) {
        return res.status(404).json({success: false, message: 'All filed are required!'})
    }

    try {
        const existingCategory = await categoriesModel.findByIdAndUpdate(
            categoryId, 
            {name, image, description, status, priority, featured},
            {new: true}
        )

        if(!existingCategory) {
            return res.status(404).json({success: false, message: 'Category not found!'})
        }


        res.status(200).json({success: true, message: 'Category update successful!'})
    } catch (error) {
        res.status(500).json({success: false, message: 'Category update failed!'})
    }
}


const categoryDelete = async (req, res) => {
    const {categoryId} = req.body;

    try {
        const category = await categoriesModel.findById(categoryId)

        if(!category) {
            return res.status(404).json({success: false, message: 'Category not found!'})
        }

        const image = category.image;

        await categoriesModel.findByIdAndDelete(categoryId)

        const imagePath = path.join(process.cwd(), 'uploads', image)
        fs.unlink(imagePath, (err) => {
            if(err) {
                console.log('Image deleting failed')
            } else {
                 console.log('Image deleting successful')
            }
        })

        res.status(200).json({success: true, message: 'Category delete successful!'})
    } catch (error) {
        res.status(500).json({success: false, message: 'Category delete failed!'})
    }
}


const categoriesList = async (req, res) => {
    try {
        const categories = await categoriesModel.find()
        
        if(!categories || categories.length == 0) {
            return res.status(404).json({success: false, message: "No categories found!"})
        }

        res.status(200).json({success: true, message: "Categories list retrieved successfully!", data: categories})
    } catch (error) {
        res.status(500).json({success: false, message: "Server error while fetching categories."})
    }
}


const getCategory = async (req, res) => {
    const {categoryId} = req.body;

    try {
        const category = await categoriesModel.findById(categoryId);

        if(!category) {
            return res.status(404).json({success: false, message: 'Category not found!'})
        }

        res.status(200).json({success: true, message: 'Category data found!', data: category})
    } catch (error) {
        res.status(500).json({success: false, message: "Server error while fetching category."})
    }
}


export {categoryAdd, categoryUpdate, categoryDelete, categoriesList, getCategory}