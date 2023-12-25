require('dotenv').config()


const express = require('express')
const expressLayout = require('express-ejs-layouts')
const methodoverride = require('method-override')
const connectDB = require('./server/config/db')
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')

const MongoStore = require('connect-mongo')
const PORT = process.env.PORT || 3000


connectDB();

app.use(express.urlencoded({extended : true}));
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser());
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    store : MongoStore.create({
        mongoUrl : process.env.MONGODB_URI
    }),
}));
app.use(methodoverride('_method'));

// Templating Engine
app.use(expressLayout)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs');




app.use('/', require('./server/Routes/main'))
app.use('/', require('./server/Routes/admin'))




app.listen(PORT, ()=> console.log(`listening on ${PORT}`))