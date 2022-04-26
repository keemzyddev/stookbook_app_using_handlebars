const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
 const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB =  require('./config/db')
const colors = require ('colors')
//const { default: mongoose } = require('mongoose')


// load config
dotenv.config({path: './config/config.env'})

//passport config
require('./config/passport')(passport)

const app = express()

//body-parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// method override
app.use(methodOverride(function (req, res ){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//hbs helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs')

//Handlebars
app.engine(
  'handlebars', exphbs({ 
  helpers: {
    formatDate,
    truncate,
    stripTags,
    editIcon,
    select
  },
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', 'handlebars')

//sessions
app.use(
  session({
  secret: 'keyboard dog',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
})
)

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global var
app.use( (req, res, next) =>{
  res.locals.user = req.user || null
  next()
})

app.use(express.static(path.join(__dirname, 'public')))


connectDB() 

//Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 5000

app.listen(5000, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.underline)
})