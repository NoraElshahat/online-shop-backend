const express = require('express')
const app = express()
const cors = require('cors');
require('./db/mongoose')
const userRouter = require('./routers/user')
const categoryRouter = require('./routers/category')
const productRouter = require('./routers/product')
const tagRouter = require('./routers/tag')
// const multer = require('multer')
// const upload = multer({
//     dest:'images',
//     limits:{
//         fileSize:100000000000
//     },
//     fileFilter(req , file , cb){
//         if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
//             return cb(new Error('You must upload an image'))
//         }
//         cb(undefined , true)

//     }
// })

// app.post('/upload' , upload.single('upload') , (req,res)=>{
//     res.status(200).send('upload successfully')
// },(error, req, res, next)=>{
//     res.status(400).send({error:error.message})    
// })


const port = process.env.port || 8000

// to convert request body to json
app.use(express.json())
app.use(cors())
//routers
app.use(userRouter)
app.use(categoryRouter)
app.use(productRouter)
app.use(tagRouter)

//connect to server 
app.listen(port,()=>{
    console.log('Server is Ready and listen to ' + port)
})