const jwt = require('jsonwebtoken');
const Usermodel = require('../models/user');


const isLogin = async (req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        verifyLogin = jwt.decode(token);
        const data = await Usermodel.findOne({ _id: verifyLogin.ID });
        // console.log(verifyLogin.payload)
        // const Data = await UserModel.findOne({token:token})
        // console.log(data)
        if (data.role == "student") {
            return res.redirect("/home");
        } else if (data.role == "admin") {
            return res.redirect("/admin/dashboard");
        }
        next();
    } else {
        next();
    }
};

module.exports = isLogin;