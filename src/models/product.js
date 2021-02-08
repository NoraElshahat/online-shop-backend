const mongoose = require('mongoose')
const Category = require('./category')
const Tag = require('../models/tag')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    price:{
        type:Number
    },
    category:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    }],
    tag:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tag'
    }]

})

const Product = mongoose.model('Product' , productSchema)

module.exports = Product