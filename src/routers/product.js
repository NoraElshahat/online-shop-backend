const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const Product = require('../models/product')
const isAdmin = require('../middleware/isAdmin')
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


//create Product
router.post('/products',upload.single('productImg'),async (req , res)=>{
    const product = new Product(req.body)
    product.productImg = req.file.filename
    try {
        await product.save()
        res.status(200).send(product)
    } catch (e) {
        const arrError = (e.message).split(",")
        console.log(arrError)
        res.status(400).send(arrError)
    }
})
//find all products
router.get('/products',async (req,res)=>{
    try {
        const products = await Product.find({}).populate('tag').exec()
        res.status(200).send(products)
    } catch (e) {
        res.status(500).send(e)
    }
})
//find one product
router.get('/products/:id',async (req,res)=>{
    const id = req.params.id
    try {
        const product = await Product.findById(id)
        if(!product){
            return res.status(400).send()
        }
        res.status(200).send(product)
    } catch (e) {
        res.status(500).send(e)
    }
})
//update product 
router.patch('/products/:id' , async (req, res)=>{
    const updateKeys = Object.keys(req.body)
    const allowedToUpdat = ['name' , 'description' , 'price']
    const isvalidToUpdate = updateKeys.some(update => allowedToUpdat.includes(update) )
    if(!isvalidToUpdate){
        return res.status(400).send({error:'Invalid update key'})
    }
    const id = req.params.id 
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id , req.body , {new:true , runValidators:true}).populate('tag').exec()
        if(!updatedProduct){
            return res.status(404).send()
        }
        res.status(200).send(updatedProduct)
    } catch (e) {
        const arrError = (e.message).split(",")
        res.status(400).send(arrError)
    }
})
//delete one product
// remove auth middleware here i'll back it again
router.delete('/products/:id' ,async (req, res) => {
    const id = req.params.id
    try {
        const deletedProduct = await Product.findByIdAndDelete(id)
        if(!deletedProduct){
            return res.status(404).send()
        }
        res.status(200).send(deletedProduct)        
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router