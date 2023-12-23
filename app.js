require('dotenv').config()


const express = require('express')
const expressLayout = require('express-ejs-layouts')
const connectDB = require('./server/config/db')
const app = express()

const PORT = process.env.PORT || 3000

connectDB();

app.use(express.urlencoded({extended : true}));
app.use(express.json())
app.use(express.static('public'))

// Templating Engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs');




app.use('/', require('./server/Routes/main'))
app.use('/', require('./server/Routes/admin'))




app.listen(PORT, ()=> console.log(`listening on ${PORT}`))