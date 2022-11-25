require("dotenv").config({path: './config.env'});
const appError = require('./utils/appError')
const express = require('express')
const userRoute = require('./routes/userRoutes')
const blogRoute = require('./routes/blogRoutes')
const errorHandler = require('./controllers/errorControllers')
const cookie = require ('cookie-parser')

const app = express()
app.use(cookie())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

//USing The Route Created
app.use('/api/blog', blogRoute)
app.use('/api/user', userRoute)


app.get('/', (req,res)=>{
    res.status(200).json({
        status: 'success',
        message: 'You are in the blog API'
    })
})


//Error Handler -G
app.all('*', (req, res, next) =>{
 return next( new appError(400, `${req.url} not found` ))
})

app.use(errorHandler)
 

module.exports = {app}