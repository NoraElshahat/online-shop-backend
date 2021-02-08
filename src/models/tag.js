const mongoose = require('mongoose')
const Product = require('../models/product')
const tagSchema = new mongoose.Schema({
    name:{
        type:String
    },
    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }]
})
const Tag = mongoose.model('Tag', tagSchema)
module.exports = Tag