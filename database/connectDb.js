const mongoose = require('mongoose')
const local_url = 'mongodb://127.0.0.1:27017/collegeportal'
const live_URL = 'mongodb+srv://sachinshrivastava380:sachin123@cluster0.u9c5r.mongodb.net/collegeportal?retryWrites=true&w=majority&appName=Cluster0'

const connectDb =()=>{
    return mongoose.connect(live_URL)
    .then(()=>{
        console.log('connect')
    }).catch(()=>{
        console.log(error)
    })
}


module.exports = connectDb