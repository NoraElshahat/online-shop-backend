const mongoose = require('mongoose')
const validator = require('validator')

const categorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'Name required'],
        trim:true
    },
    details:{
        type:String,
        required :[true , 'Detail Required'],
    },
    categoryImg :{
        type:String
    }
})
const Category = mongoose.model('Category',categorSchema)

module.exports = Category
