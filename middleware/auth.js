const jwt = require('jsonwebtoken')
const UserModal = require('../models/user')

const checkAuth = async(req,res,next)=>{
    // console.log("authcheck")
    const {token} = req.cookies
    console.log(token)
    if(!token){
        req.flash('error','Please Login First')
        res.redirect('/')
    }else{
        const verifyToken = jwt.verify(token,'qwertyuiop')
        // console.log(verifyToken)
        const data = await UserModal.findOne({_id:verifyToken.ID})
        // console.log(data)
        req.udata = data
        next()
    }
}
module.exports = checkAuth