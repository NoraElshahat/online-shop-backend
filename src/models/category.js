const mongoose = require('mongoose')
const categorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    details:{
        type:String,
        required :true,
    },
    categoryImg :{
        type:Buffer
    }
})
const Category = mongoose.model('Category',categorSchema)

module.exports = Category
