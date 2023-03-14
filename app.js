if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}



const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize')
const user = require('./models/user')
const userRoutes = require('./routes/users')

const MongoStore = require('connect-mongo')
//const dbUrl = process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://0.0.0.0:27017/yelp-camp'
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, })

    .then(() => {
        console.log("Mongo Connection open")
    })
    .catch(err => {
        console.log("Error")
        console.log(err)
    })


const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))



app.use(express.static(path.join(__dirname, 'public')))

app.use(mongoSanitize({
    replaceWith: '_'
}))


const Secret = process.env.SECRET || 'thisisnotagoodsecret'
const options = {
    mongoUrl: dbUrl,
    secret: Secret,
    touchAfter: 24 * 60 * 60

}

const sessionConfig = {
    store: MongoStore.create(options),
    name: 'session', // we don't wanna use the default name..cuz  we don't want the hackers to know about our session !!!
    secret: Secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, //It means that the cookie can only be accessed through https. WE use this in production
        expires: Date.now() + 604800000, // Date.now() shows the date in milliseconds..so we do the req calculations. (1000*60*60*24*7)
        maxAge: 604800000
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())


app.use((req, res, next) => {

    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)

app.get('/', (req, res) => {
    res.render('home')
})





app.use('/campgrounds', reviewRoutes)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
}) // this will pass on the error to the app.use()below

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err  //since ExpressError is passed on to err of this function , it's destructured
    if (!err.message) err.message = 'Oh no something went wrong :('
    res.status(statusCode).render('error', { err })
})



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})