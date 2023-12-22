require('dotenv').config()


const express = require('express')
const expressLayout = require('express-ejs-layouts')
const connectDB = require('./server/config/db')
const app = express()

const PORT = process.env.PORT || 3000

connectDB();

app.use(express.static('public'))

// Templating Engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs');




app.use('/', require('./server/Routes/main'))




app.listen(PORT, ()=> console.log(`listening on ${PORT}`))