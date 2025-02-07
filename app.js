const express = require('express')
const app = express()
const port = 3000
const web = require('./routes/web')
const connectDb = require('./database/connectDb')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')



// image upload
app.use(fileUpload({useTempFiles : true}))
//token get cookie
app.use(cookieParser())

//view ejs set
app.set('view engine', 'ejs')
//css or image link
app.use(express.static('public'))
//connect db
connectDb()
//parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

//connect flash and session
const session = require('express-session')
const flash = require('connect-flash')
//message
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
}));
// flash message
app.use(flash());




// route load
app.use('/', web)
//server create
app.listen(port, () => {
  console.log(`Server start local host: ${port}`)
})