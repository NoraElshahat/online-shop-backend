const express = require('express')
const  mongoose  = require('mongoose')
const auth = require('../middleware/auth')
const router = express.Router()
const User = require('../models/user')


//login user 
router.post('/users/login' ,async (req,res)=>{
    try {
        const user = await User.findByCredintials(req.body.email , req.body.password)
        const token = await user.getToken()
        res.send({user , token})
    } catch (e) {
        const arrError = (e.message).split(",")
        res.status(400).send(arrError)
    }
})
//create user
router.post('/users',async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save()
        const token = await user.getToken()
        res.status(200).send({user , token})
    }catch(e){
        const arrError = (e.message).split(",")
        res.status(400).send(arrError)
    }
})

//logout user 
router.post('/users/logout' ,auth ,async(req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token
        })
        await req.user.save()
        res.send('logout successfully')
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//logout all session 
router.post('/users/logoutAll',auth, async(req, res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// find users
router.get('/users/me',auth,async (req,res)=>{
   res.send(req.user)
})

//find one user
router.get('/users/:id',async (req,res)=>{
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (e) {
        console.log(e)
        return res.status(400).send()
    }
})

//update one user
router.patch('/users/:id', async (req,res)=>{

    // to prevent user to update on field that not found
    const updateKeys = Object.keys(req.body)
    const allowedToUpdat = ['name' , 'email' , 'password']
    const isvalidToUpdate = updateKeys.every(update => allowedToUpdat.includes(update) )
    if(!isvalidToUpdate){
        return res.status(400).send({error:'Invalid update key'})
    }
    const id = req.params.id
    try {
        const user = await User.findById(id)
        updateKeys.forEach(update => user[update] = req.body[update])
        await user.save()
        if(!user){
            return res.status(404).send()
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//delete one user 
router.delete('/users/:id', async (req , res)=>{
    const id = req.params.id
    try {
        const deletedUser = await User.findByIdAndDelete(id)
        if(!deletedUser){
            return res.status(404).send()
        }
        res.status(200).send(deletedUser)
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router