const User = require('../models/user')

const isAdmin = async(req,res,next) => {
	try{
		const admin = req.user.isAdmin
		if(!admin){
			throw new Error('you aren\'t admin')
		}
		next()
	}catch(error){
		res.status(401).send({error:'Not Authenticated'})

	}
}
module.exports = isAdmin