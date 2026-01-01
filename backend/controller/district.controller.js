import { districtModel } from "../models/distirct.model.js";
import fs from 'fs'
import path from 'path'

const createDistrict = async (req, res) => {
    const { name, isEnable } = JSON.parse(req.body.district)

    const image = req.file?.filename;

    if (!name || !image || !isEnable) {
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
        return res.status(404).json({ success: false, message: 'All field are required!' })
    }
    try {
        const district = await districtModel({ name, image, isEnable })

        await district.save()

        res.status(201).json({ success: true, message: 'District add successful!' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Something is wrong try again!' })
    }
}


const deleteDistrict = async (req, res) => {
    const districtId = req.params.id;

    if (!districtId) {
        return res.status(404).json({ success: false, message: 'District not found!' })
    }
    try {
        const district = await districtModel.findById(districtId)

        if (district) {
            const imagePath = path.join('uploads', district.image)
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.log('Image deleting failed')
                } else {
                    console.log('Image deleting successful')
                }
            })

        }

        await districtModel.findByIdAndDelete(districtId)

        res.status(200).json({ success: true, message: 'District delete successful!' })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Something is wrong please try again!' })
    }
}


const updateDistrict = async (req, res) => {
    const district = JSON.parse(req.body.district)

    const { name, isEnable, districtId } = district;
    const image = req.file ? req.file.filename : district.image

    if (!name || !image || !isEnable || !districtId) {
        return res.status(404).json({ success: false, message: 'All field are required!' })
    }

    try {
        const district = await districtModel.findById(districtId);

        if (!district) {
            return res.status(404).json({ success: false, message: 'District not found!' })
        }

        const imagePath = path.join('uploads', district.image)
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log('Image deleting failed')
            } else {
                console.log('Image deleting successful')
            }
        })

        await districtModel.findByIdAndUpdate(
            districtId,
            { name, image, isEnable },
            { new: true }
        )

        res.status(200).json({ success: true, message: 'District update successful!' })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something is wrong try again!' })
    }
}


const getDistrict = async (req, res) => {
    const districtId = req.params.id;
    try {

        const district = await districtModel.findById(districtId)

        if (!district) {
            return res.status(404).json({ success: false, message: 'District not found!' })
        }

        res.status(200).json({ success: true, message: 'District found successful!', data: district })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Something is wrong try again!' })
    }
}

const getAllDistricts = async (req, res) => {
    try {
        const districts = await districtModel.find()

        if (!districts) {
            return res.status(404).json({ success: false, message: 'District not found!' })
        }

        res.status(200).json({ success: true, message: 'District found successful!', data: districts })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something is wrong please try!' })
    }
}




export { createDistrict,  deleteDistrict, getAllDistricts, getDistrict, updateDistrict }




