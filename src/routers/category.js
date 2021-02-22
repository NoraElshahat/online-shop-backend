const express = require('express')
const router = express.Router()
const Category = require('../models/category')

const multer = require('multer')
const upload = multer({
    dest:'./uploads',
    limits:{
        fileSize:100000000000
    },
    fileFilter(req , file , cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('You must upload an image'))
        }
        cb(undefined , true)

    }
})

//upload image for category
// router.post('/upload' , upload.single('categoryImg') , async(req, res, next)=>{
//     const category = req.body
//     category.categoryImg = req.file.buffer
//     await category.save()
//     res.status(200).send('upload successfully')
// },(error, req, res, next)=>{
//     res.status(400).send({error:error.message})    
// })


//create Category
router.post('/categories',upload.single('categoryImg'),async (req , res )=>{
    console.log(req.body , 'from back');
    const category = new Category(req.body)
    try {
        await category.save()
        res.status(200).send(category)
    } catch (e) {
        res.status(400).send(e._message)
    }
})
//find all categories
router.get('/categories',async (req,res)=>{
    try {
        const categories = await Category.find({})
        res.status(200).send(categories)
    } catch (e) {
        res.status(500).send(e)
    }
})
//find one category
router.get('/categories/:id',async (req,res)=>{
    // console.log('hello find one');
    const id = req.params.id
    try {
        const category = await Category.findById(id)
        if(!category){
            return res.status(400).send()
        }
        res.status(200).send(category)
    } catch (e) {
        res.status(500).send(e)
    }
})
//update category 
router.patch('/categories/:id' , async (req, res)=>{
    const updateKeys = Object.keys(req.body)
    const allowedToUpdat = ['name' , 'details']
    const isvalidToUpdate = updateKeys.some(update => allowedToUpdat.includes(update) )
    if(!isvalidToUpdate){
        return res.status(400).send({error:'Invalid update key'})
    }
    const id = req.params.id 
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id , req.body , {new:true , runValidators:true})
        if(!updatedCategory){
            return res.status(404).send()
        }
        res.status(200).send(updatedCategory)
    } catch (e) {
        return res.status(500).send()
    }
})
//delete one category
router.delete('/categories/:id' , async (req, res) => {
    const id = req.params.id
    try {
        const deletedCategory = await Category.findByIdAndDelete(id)
        if(!deletedCategory){
            return res.status(404).send()
        }
        res.status(200).send(deletedCategory)        
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router