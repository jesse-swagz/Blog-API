require("dotenv").config({path: './config.env'});
const appError = require('./utils/appError')
const express = require('express')
const app = express()
const userRoute = require('./routes/userRoutes')
const blogRoute = require('./routes/blogRoutes')
const errorHandler = require('./controllers/errorControllers')
const cookie = require ('cookie-parser')


app.use(cookie())

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/api/blog', blogRoute)
app.use('/api/user', userRoute)


app.get('/', (req,res)=>{
    res.status(200).json({
        status: 'success',
        message: 'You are in the blog API'
    })
})


//Error Handler -G
app.all('*', (req, res, next, err) =>{
 return next( new appError(400, `${req.Url} not found` ))
})

app.use(errorHandler)
 

module.exports = {app}