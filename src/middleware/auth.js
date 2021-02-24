const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req, res, next) => {
     try {
         const token = req.headers['authorization'].replace("Bearer",'').trim()
         const decode = jwt.verify(token,'thisismytoken')
         const user = await User.findOne({_id:decode._id , 'tokens.token':token})
         if(!user){
             throw new Error()
         }
         req.token = token
         req.user = user
         next()
     } catch (e) {
        console.log(e.message);
         res.status(401).send({error:'Not Authenticated'})
     }
}

module.exports = auth