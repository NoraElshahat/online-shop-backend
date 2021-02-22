const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const Product = require('../models/product')

//create Product
router.post('/products',async (req , res)=>{
    const product = new Product(req.body)
    try {
        await product.save()
        res.status(200).send(product)
    } catch (e) {
        res.status(400).send(e)
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
        return res.status(500).send()
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