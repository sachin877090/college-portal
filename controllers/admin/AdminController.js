const CourseModel = require('../../models/course')
const nodemailer = require('nodemailer')      // npm i nodemailer
const contactModel = require('../../models/contact')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary')
const UserModel = require('../../models/user')

// Configuration
cloudinary.config({
    cloud_name: 'dwrrsabdy',
    api_key: '638798748289963',
    api_secret: '7RbJbvmxFt6Uds-mVdPs4q_-elg'
});

class AdminController {
    static dashboard = async (req, res) => {
        try {
          const { name, email, image } = req.udata;
          const totalUsers = await CourseModel.countDocuments();
          const approvedUsers = await CourseModel.countDocuments({
            status: "Approved",
          });
          const pendingUsers = await CourseModel.countDocuments({
            status: "Pending",
          });
          const rejectedUsers = await CourseModel.countDocuments({
            status: "Reject",
          });
          res.render("admin/dashboard", {
            n: name,
            i: image,
            e: email,
            totalUsers,
            approvedUsers,
            pendingUsers,
            rejectedUsers,
          });
        } catch (error) {
          console.log(error);
        }
      };
    static courseDisplay = async (req, res) => {
        try {
            const { name, email, image } = req.udata
            const course = await CourseModel.find()
            res.render('admin/courseDisplay', { n: name, i: image, e: email, c: course })
        } catch (error) {
            console.log(error)
        }
    }
    static update_status = async (req, res) => {
        try {
            const id = req.params.id;
            const { name, email, course, status, comment } = req.body
            await CourseModel.findByIdAndUpdate(id, {
                status,
                comment,
            })
            if (status == "Reject") {
                this.RejectEmail(name, email, course, status, comment)
            } else {
                this.ApprovedEmail(name, email, course, status, comment)
            }
            //  this.sendEmail(name,email,course,status,comment)
            res.redirect('/admin/Coursedisplay')
        } catch (error) {
            console.log(error)
        }
    }
    static RejectEmail = async (name, email, course, status, comment) => {
        //console.log(name, email, course)
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
            subject: ` Course ${course} Reject`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Message Registered Successfully</div>
                <div class="email-body">
                    <p>Dear <b>${name}</b>,</p>
                     
                    <p>Unfortunately, your course has been rejected. Please review the feedback below for further details:<br>
                   ${comment}</p>
                    <p>We appreciate your effort and encourage you to reach out if you have any questions or need clarification.</p>
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    The Support Team
                </div>
            </div>
        </body>
         `, // html body
        });
    };
    static ApprovedEmail = async (name, email, course, status, comment) => {
        console.log(name, email, course)
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
            subject: ` Course ${course} Approved`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    margin-bottom: 20px;
                }
                .email-footer {
                    font-size: 14px;
                    color: #777777;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">Message Registered Successfully</div>
                <div class="email-body">
                    <p>Dear <b>${name}</b>,</p>
                   <p>We are pleased to inform you that your course has been approved! Congratulations on your hard work and dedication.<br>
                   ${comment}<p>
                    <p>We appreciate your effort and encourage you to reach out if you have any questions or need clarification.</p>
                </div>
                <div class="email-footer">
                    Thank you,<br>
                    The Support Team
                </div>
            </div>
        </body>
             `, // html body
        });
    }
    static sendEmail = async (name, email, course) => {
        //   console.log(name,email,course)
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
            subject: ` Course ${course}`, // Subject line
            text: "heelo", // plain text body
            html: `<head>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      line-height: 1.6;
                       /* Replace with your image URL */
                      background-size: cover;
                      background-repeat: no-repeat;
                      background-position: center;
                      margin: 0;
                      padding: 0;
                  }
                  .email-container {
                      margin: 0 auto;
                      padding: 20px;
                      max-width: 600px;
                      background: rgba(255, 255, 255, 0.9); /* Optional: Add transparency for readability */
                      border: 1px solid #ccc;
                      border-radius: 5px;
                  }
                  .email-header {
                      font-size: 18px;
                      font-weight: bold;
                      margin-bottom: 10px;
                  }
                  .email-body {
                      margin-bottom: 20px;
                  }
                  .email-footer {
                      font-size: 14px;
                      color: #555;
                  }
              </style>
          </head>
          <body>
              <div class="email-container">
                  <div class="email-header">Course Enrollment Successful</div>
        
                  <div class="email-body">
                      <p><b>${name}</b>,</p>
        
                      <p>Your enrollment in the course <b>${course}</b> has been successfully processed!</p>
        
                      <p>We are excited to have you on board. Please feel free to reach out if you have any questions or need assistance.</p>
                  </div>
        
                  <div class="email-footer">
                      Thank you,<br>
                      The Support Team
                  </div>
              </div>
          </body>
               `, // html body
        });
    }
    static courseView = async (req, res) => {
        try {
          const { name, image } = req.udata;
          const id = req.params.id;
          //console.log(id)
          const course = await CourseModel.findById(id);
          // console.log(course)
          res.render("admin/view", { c: course, n: name, i: image });
        } catch (error) {
          console.log(error);
        }
      };
    
      static courseDelete = async (req, res) => {
        try {
          const { name, image } = req.udata;
          const id = req.params.id;
          //console.log(id)
          const course = await CourseModel.findByIdAndDelete(req.params.id);
          //console.log(course)
          // res.render("admin/view", { item: course, n: name, i: image });
          res.redirect("/admin/courseDisplay");
        } catch (error) {
          console.log(error);
        }
      };
    
      static courseEdit = async (req, res) => {
        try {
          const { name, image } = req.udata;
          const id = req.params.id;
          //console.log(id)
          const course = await CourseModel.findById(req.params.id);
          //console.log(course)
          res.render("admin/editCourse", { c: course, n: name, i: image });
        } catch (error) {
          console.log(error);
        }
      };
    
      static update_course = async (req, res) => {
        try {
          const id = req.params.id;
          const { name, email, phone, education, gender, dob, course, address } =
            req.body;
          await CourseModel.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            address,
            dob,
            gender,
            education,
            course,
          });
          req.flash("success", "Course updated successfully by Admin.");
          res.redirect("/admin/Coursedisplay");
        } catch (error) {
          console.log(error);
        }
      };
    
      static contactDisplay = async (req, res) => {
        try {
          const { name, image, email } = req.udata;
          const course = await contactModel.find();
    
          res.render("admin/contactDisplay", {
            n: name,
            i: image,
            e: email,
            c: course,
          });
        } catch (error) {
          console.log(error);
        }
      };
    
      static delete_message = async (req, res) => {
        try {
          const id = req.params.id;
          await contactModel.findByIdAndDelete(id);
    
          res.redirect("/admin/contactDisplay");
        } catch (error) {
          console.log(error);
        }
      };
    
      static update_pass = async (req, res) => {
        try {
          const { name, image, email } = req.udata;
          res.render("admin/updatePass", {
            n: name,
            i: image,
            e: email,
            msg: req.flash("error"),
            msg1: req.flash("success"),
          });
        } catch (error) {
          console.log(error);
        }
      };
    
      static profile_update = async (req, res) => {
        try {
          const { name, image, email } = req.udata;
          res.render("admin/profileUpdate", {
            n: name,
            i: image,
            e: email,
            msg: req.flash("success"),
          });
        } catch (error) {
          console.log(error);
        }
      };
    
      static changePassword = async (req, res) => {
        try {
          const { id } = req.udata;
          // console.log(req.body);
          const { op, np, cp } = req.body;
          if (op && np && cp) {
            const user = await UserModel.findById(id);
            const isMatched = await bcrypt.compare(op, user.password);
            //console.log(isMatched)
            if (!isMatched) {
              req.flash("error", "Current password is incorrect ");
              res.redirect("/admin/update_pass");
            } else {
              if (np != cp) {
                req.flash("error", "Password does not match");
                res.redirect("/admin/update_pass");
              } else {
                const newHashPassword = await bcrypt.hash(np, 10);
                await UserModel.findByIdAndUpdate(id, {
                  password: newHashPassword,
                });
                req.flash("success", "Password Updated by Admin successfully ");
                res.redirect("/admin/update_pass");
              }
            }
          } else {
            req.flash("error", "ALL fields are required ");
            res.redirect("/admin/update_pass");
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      static updateProfile = async (req, res) => {
        try {
          const { id } = req.udata;
          const { name, email } = req.body;
          if (req.files) {
            const user = await UserModel.findById(id);
            const imageID = user.image.public_id;
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
          req.flash("success", "Profile Update by Admin successfully");
          res.redirect("/admin/profile_update");
        } catch (error) {
          console.log(error);
        }
      };
    
      // ApprovedUsers
      static ApprovedUsers = async (req, res) => {
        try {
          const { name, email, image } = req.udata;
          const course = await CourseModel.find({ status: "Approved" });
          res.render("admin/approvedUsers", {
            n: name,
            i: image,
            e: email,
            c: course,
          });
        } catch (error) {
          console.log(error);
        }
      };
    
      // PendingUsers
      static PendingUsers = async (req, res) => {
        try {
          const { name, email, image } = req.udata;
          const course = await CourseModel.find({ status: "Pending" });
          res.render("admin/pendingUsers", {
            n: name,
            i: image,
            e: email,
            c: course,
          });
        } catch (error) {
          console.log(error);
        }
      };
    
      // RejectUsers
      static RejectUsers = async (req, res) => {
        try {
          const { name, email, image } = req.udata;
          const course = await CourseModel.find({ status: "Reject" });
          res.render("admin/rejectUsers", {
            n: name,
            i: image,
            e: email,
            c: course,
          });
        } catch (error) {
          console.log(error);
        }
      };
}
module.exports = AdminController