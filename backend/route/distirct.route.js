import express from 'express'
import { createDistrict, deleteDistrict, getAllDistricts, getDistrict, updateDistrict } from '../controller/district.controller.js'
import { uploads } from '../middleware/upload.js'

const districtRoute = express.Router()

districtRoute.post('/add', uploads.single('image'), createDistrict)
districtRoute.get('/list', getAllDistricts)
districtRoute.delete('/delete/:id', deleteDistrict)
districtRoute.get('/data/:id', getDistrict)
districtRoute.put('/update', uploads.single('image'), updateDistrict)


export { districtRoute }