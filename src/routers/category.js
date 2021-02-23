const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req , file , cb){
        cb(null , './public/uploads');
    },
    filename: function(req , file , cb){
        cb(null, Date.now()+file.originalname)
    }
});
const upload = multer({
    storage:storage,
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

//create Category
router.post('/categories',upload.single("categoryImg"),async (req , res )=>{
    console.log(req.body , req.file , 'from back');
    const category = new Category(req.body)
    category.categoryImg = req.file.filename
    try {
        await category.save()
        res.status(200).send(category)
    } catch (e) {
        const arrError =(e.message).split(",")
        res.status(400).send(arrError)
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
router.patch('/categories/:id' , upload.single("categoryImg"),async (req, res)=>{
    const updateKeys = Object.keys(req.body)
    const allowedToUpdat = ['name' , 'details' , 'categoryImg']
    const isvalidToUpdate = updateKeys.some(update => allowedToUpdat.includes(update) )
    if(!isvalidToUpdate){
        return res.status(400).send({error:'Invalid update key'})
    }
    const id = req.params.id 
    try {
        const needToUpdate = req.body
        needToUpdate.categoryImg = req.file.filename
        const updatedCategory = await Category.findByIdAndUpdate(id , needToUpdate , {new:true , runValidators:true})
        if(!updatedCategory){
            return res.status(404).send()
        }
        updatedCategory.categoryImg = req.file.filename
        res.status(200).send(updatedCategory)
    } catch (e) {
        const arrError = (e.message).split(",")
        res.status(400).send(arrError)
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