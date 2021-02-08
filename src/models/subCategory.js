const mongoose = require('mongoose')
const Category = require('./category')

const subCatSchema = new mongoose.Schema({ name :{
    type:String,
    required:true
},
category_id :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
}})
const SubCategory = mongoose.model('SubCategory' ,subCatSchema)

module.exports = SubCategory
