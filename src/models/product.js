const mongoose = require('mongoose')
const Category = require('./category')
const Tag = require('../models/tag')


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is Required']
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        required:[true , 'Price is required']
    },
    category:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:[true , 'Category required']
    }],
    tag:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tag'
    }] ,
    productImg :{
        type:String
    }

})

const Product = mongoose.model('Product' , productSchema)

module.exports = Product