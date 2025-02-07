const UserModal = require('../models/user')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary')
const jwt = require('jsonwebtoken')
const CourseModel = require('../models/course')
const randomstring = require("randomstring")
const nodemailer = require('nodemailer')

// Configuration
cloudinary.config({
    cloud_name: 'dwrrsabdy',
    api_key: '638798748289963',
    api_secret: '7RbJbvmxFt6Uds-mVdPs4q_-elg'
});

class Frontcontroller {
    static home = async (req, res) => {
        try {
            const { name, image, email, id } = req.udata
            const btech = await CourseModel.findOne({ user_id: id, course: "btech" })
            const bca = await CourseModel.findOne({ user_id: id, course: "bca" })
            const mca = await CourseModel.findOne({ user_id: id, course: "mca" })

            console.log(btech)
            res.render('home', { n: name, i: image, e: email, bca: bca, mca: mca, btech: btech })
        } catch (error) {
            console.log(error)
        }
    }
    static about = async (req, res) => {
        try {
            const { name, image } = req.udata
            res.render("about", { n: name, i: image })
        } catch (error) {
            console.log(error)
        }
    }
    static contact = async (req, res) => {
        try {
            const { name, image } = req.udata
            res.render("contact", { n: name, i: image })
        } catch (error) {
            console.log(error)
        }
    }
    static login = async (req, res) => {
        try {
            res.render("login", { msg: req.flash('success'), msg1: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }
    static register = async (req, res) => {
        try {
            res.render("register", { msg: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }
    //user insert
    static userinsert = async (req, res) => {
        try {

            // console.log(req.files)

            // console.log(req.body)
            const { name, email, password, confirmpassword } = req.body
            if (!name || !email || !password || !confirmpassword) {
                req.flash("error", "All Field are Required.");
                return res.redirect('/register');
            }
            const isEmail = await UserModal.findOne({ email });
            if (isEmail) {
                req.flash("error", "email alredy exist.");
                return res.redirect("/register")
            }
            if (password != confirmpassword) {
                req.flash("error", "password dose not match");
                return res.redirect("/register");
            }
            const file = req.files.image;
            const imageUpload = await cloudinary.uploader.upload(
                file.tempFilePath, {
                folder: "userprofile",
            }
            );
            // console.log(imageUpload)
            const hashpassword = await bcrypt.hash(password, 10)

            const data = await UserModal.create({
                name,
                email,
                password: hashpassword,
                image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url
                }
            });
            req.flash("success", "Register Successfully ! please login here");
            res.redirect("/"); //route ** web
        } catch (error) {
            console.log(error)
        }
    }
    //verifilogin
    static verifyLogin = async (req, res) => {
        try {
            // console.log(req.body)
            const { email, password } = req.body

            const isEmail = await UserModal.findOne({ email });
            if (!isEmail) {
                req.flash("error", "You are not register");
                return res.redirect("/")
            } else {
                const isMatch = await bcrypt.compare(password, isEmail.password)
                // console.log(isMatch)
                if (isMatch) {

                    //token
                    if (isEmail.role == 'admin') {
                        const token = jwt.sign({ ID: isEmail.id }, 'qwertyuiop')
                        // console.log(token)
                        res.cookie('token', token)
                        return res.redirect("/admin/dashboard")
                    }
                    if (isEmail.role == 'student') {
                        const token = jwt.sign({ ID: isEmail.id }, 'qwertyuiop')
                        // console.log(token)
                        res.cookie('token', token)
                        return res.redirect('/home')
                    }

                } else {
                    req.flash("error", "email or password does't match");
                    return res.redirect("/")
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    static logout = async (req, res) => {
        try {
            res.clearCookie('token')
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }
    static profile = async (req, res) => {
        try {
            const { name, image, email } = req.udata
            res.render("profile", { n: name, i: image, e: email, message: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }
    static changePassword = async (req, res) => {
        try {
            const { id } = req.udata
            // console.log(req.body);
            const { op, np, cp } = req.body;
            if (op && np && cp) {
                const user = await UserModal.findById(id);
                const isMatched = await bcrypt.compare(op, user.password);
                //console.log(isMatched)
                if (!isMatched) {
                    req.flash("error", "Current password is incorrect ");
                    res.redirect("/profile");
                } else {
                    if (np != cp) {
                        req.flash("error", "Password does not match");
                        res.redirect("/profile");
                    } else {
                        const newHashPassword = await bcrypt.hash(np, 10);
                        await UserModal.findByIdAndUpdate(id, {
                            password: newHashPassword,
                        });
                        req.flash("success", "Password Updated successfully ");
                        res.redirect("/");
                    }
                }
            } else {
                req.flash("error", "ALL fields are required ");
                res.redirect("/profile");
            }
        } catch (error) {
            console.log(error);
        }

    }
    static updateProfile = async (req, res) => {
        try {
            const { id } = req.udata
            const { name, email, role } = req.body;
            if (req.files) {
                const user = await UserModel.findById(id);
                const imageID = user.image.public_id
                // console.log(imageID);

                //deleting image from Cloudinary
                await cloudinary.uploader.destroy(imageID);
                //new image update
                const imagefile = req.files.image;
                const imageupload = await cloudinary.uploader.upload(
                    imagefile.tempFilePath,
                    {
                        folder: "userprofile",
                    }
                );
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageupload.public_id,
                        url: imageupload.secure_url,
                    },
                };
            } else {
                var data = {
                    name: name,
                    email: email,
                };
            }
            await UserModel.findByIdAndUpdate(id, data);
            req.flash("success", "Update Profile successfully");
            res.redirect("/profile");
        } catch (error) {
            console.log(error);
        }
    }
    static forgetPasswordVerify = async (req, res) => {
        try {
            const { email } = req.body;
            const userData = await UserModal.findOne({ email: email });
            //console.log(userData)
            if (userData) {
                const randomString = randomstring.generate();
                await UserModal.updateOne(
                    { email: email },
                    { $set: { token: randomString } }
                );
                this.sendEmail(userData.name, userData.email, randomString);
                req.flash("success", "Plz Check Your mail to reset Your Password!");
                res.redirect("/");
            } else {
                req.flash("error", "You are not a registered Email");
                res.redirect("/");
            }
        } catch (error) {
            console.log(error);
        }
    }
    static sendEmail = async (name, email, token) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "sachinshrivastava380@gmail.com",
                pass: "oqjz bsru hafh ucth",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Reset Password", // Subject line
            text: "heelo", // plain text body
            html: "<p>Hii " +
                name +
                ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
                token +
                '">Reset</a>Your Password.',

        });
    }
    static reset_Password = async (req, res) => {
        try {
          const token = req.query.token;
          const tokenData = await UserModal.findOne({ token: token });
          if (tokenData) {
            res.render("reset-password", { user_id: tokenData._id });
          } else {
            res.render("404");
          }
        } catch (error) {
          console.log(error);
        }
    }
    static reset_Password1 = async (req, res) => {
        try {
          const { password, user_id } = req.body;
          const newHashPassword = await bcrypt.hash(password, 10);
          await UserModal.findByIdAndUpdate(user_id, {
            password: newHashPassword,
            token: "",
          });
          req.flash("success", "Reset Password Updated successfully ");
          res.redirect("/");
        } catch (error) {
          console.log(error);
        }
    }
}
module.exports = Frontcontroller
