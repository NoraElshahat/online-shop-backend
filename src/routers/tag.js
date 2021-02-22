const express = require('express')
const router = express.Router()
const Tag = require('../models/tag')


//create Tag
router.post('/tags',async (req , res)=>{
    const tag = new Tag(req.body)
    try {
        await tag.save()
        res.status(200).send(tag)
    } catch (e) {
        res.status(400).send(e)
    }
})
//find all tags
router.get('/tags',async (req,res)=>{
    try {
        const tags = await Tag.find({})
        res.status(200).send(tags)
    } catch (e) {
        res.status(500).send(e)
    }
})
//find one tag
router.get('/tags/:id',async (req,res)=>{
    const id = req.params.id
    try {
        const tag = await Tag.findById(id)
        if(!tag){
            return res.status(400).send()
        }
        res.status(200).send(tag)
    } catch (e) {
        res.status(500).send(e)
    }
})
//update tag 
router.patch('/tags/:id' , async (req, res)=>{
    const updateKeys = Object.keys(req.body)
    const allowedToUpdat = ['name']
    const isvalidToUpdate = updateKeys.some(update => allowedToUpdat.includes(update) )
    if(!isvalidToUpdate){
        return res.status(400).send({error:'Invalid update key'})
    }
    const id = req.params.id 
    try {
        const updateTag = await Tag.findByIdAndUpdate(id , req.body , {new:true , runValidators:true})
        if(!updateTag){
            return res.status(404).send()
        }
        res.status(200).send(updateTag)
    } catch (e) {
        return res.status(500).send()
    }
})
//delete one product
router.delete('/tags/:id' , async (req, res) => {
    const id = req.params.id
    try {
        const deleteTag = await Tag.findByIdAndDelete(id)
        if(!deleteTag){
            return res.status(404).send()
        }
        res.status(200).send(deleteTag)        
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
