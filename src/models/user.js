const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name :{
        type:String,
        trim:true,
        required :[true, 'Name required']
    },
    email:{
        type : String,
        unique:true,
        required : [true , 'Enter You Email'],
        trim:true,
        lowercase: true,
        validate(val){
            if(!validator.isEmail(val))
                throw new Error('Enter a validate Email')
        }
    },
    password :{
        type : String,
        required : [true , 'Enter You Password'],
        minlength:7,
        trim:true,
        validate(val){
            if(val.includes('password')){
                throw new Error('passowrd shouldn\'t contain "password"' )
            }
        }
    },
    isAdmin :{
        type : Boolean,
        default:false
    },
    isDisable:{
        type:Boolean,
        default:false
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

userSchema.methods.getToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()} , 'thisismytoken')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findByCredintials = async (email , password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable To login')
    }
    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
        throw new Error ('Unable To Login')
    }
    return user
}
userSchema.pre('save' , async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8)
    }
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User