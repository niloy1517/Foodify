import express from 'express'
import { categoryAdd, categoryDelete, categoryUpdate, categoriesList, getCategory } from '../controller/categories.controller.js'
import { uploads } from '../middleware/upload.js'

const categoryRoute = express.Router()

categoryRoute.post('/add', uploads.single('image'), categoryAdd)
categoryRoute.post('/update', uploads.single('image'), categoryUpdate)
categoryRoute.delete('/delete', categoryDelete)
categoryRoute.get('/list', categoriesList)
categoryRoute.post('/data', getCategory)


export {categoryRoute}