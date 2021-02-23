const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path')
require('./db/mongoose')
const userRouter = require('./routers/user')
const categoryRouter = require('./routers/category')
const productRouter = require('./routers/product')
const tagRouter = require('./routers/tag')

const port = process.env.port || 8000

// to convert request body to json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname ,'../public')));
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